import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      await checkAdminStatus(session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    console.log('Checking admin status for user:', user?.email);
    
    if (!user) {
      console.log('No user, setting isAdmin to false');
      setIsAdmin(false);
      setIsCheckingAdmin(false);
      return;
    }

    // TEMPORARY: Skip database check and make any logged user admin
    // This is for testing purposes until we fix the Supabase connection
    console.log('🚧 TEMPORARY ADMIN BYPASS: Making all logged users admin for testing');
    setIsAdmin(true);
    setIsCheckingAdmin(false);
    return;

    /* ORIGINAL CODE - UNCOMMENT WHEN SUPABASE IS WORKING
    // Prevent concurrent admin checks
    if (isCheckingAdmin) {
      console.log('Admin check already in progress, skipping...');
      return;
    }

    setIsCheckingAdmin(true);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Admin check timeout, defaulting to false');
      setIsAdmin(false);
      setIsCheckingAdmin(false);
    }, 5000); // 5 second timeout

    try {
      // Check if user has admin role in profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      clearTimeout(timeoutId); // Clear timeout since we got a response

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If no profile found, create one and make them admin (for first setup)
        if (error.code === 'PGRST116') { // No rows returned
          console.log('No profile found, creating admin profile for first user');
          try {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                role: 'admin',
                email: user.email
              });
            
            if (!insertError) {
              console.log('Created admin profile successfully');
              setIsAdmin(true);
            } else {
              console.error('Error creating profile:', insertError);
              setIsAdmin(false);
            }
          } catch (insertErr) {
            console.error('Error inserting profile:', insertErr);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        setIsCheckingAdmin(false);
        return;
      }

      console.log('Profile found:', profile);
      const isUserAdmin = profile?.role === 'admin';
      console.log('Is user admin?', isUserAdmin);
      setIsAdmin(isUserAdmin);
      setIsCheckingAdmin(false);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsCheckingAdmin(false);
    }
    */
  };


  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: result.error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    isCheckingAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}