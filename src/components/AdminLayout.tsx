import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FolderOpen, 
  Settings, 
  LogOut,
  Menu,
  Home,
  Shield
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Livros',
    href: '/admin/livros',
    icon: BookOpen,
  },
  {
    name: 'Autores',
    href: '/admin/autores',
    icon: Users,
  },
  {
    name: 'Categorias',
    href: '/admin/categorias',
    icon: FolderOpen,
  },
  {
    name: 'Configurações',
    href: '/admin/configuracoes',
    icon: Settings,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex h-full flex-col ${mobile ? '' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-library-bronze">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-library-gold rounded-full flex items-center justify-center">
            <Shield className="h-4 w-4 text-library-wood" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-library-wood">
              Admin Panel
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={`
                    group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors font-body
                    ${
                      isActive
                        ? 'bg-library-gold text-library-wood shadow-sm'
                        : 'text-library-bronze hover:text-library-wood hover:bg-library-gold/10'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-library-bronze p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-library-bronze rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-library-parchment">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-library-wood truncate font-body">
              {user?.email}
            </p>
            <p className="text-xs text-library-bronze font-body">
              Administrador
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full justify-start border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-library-parchment font-body"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Ver Site
            </Link>
          </Button>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50 font-body"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-library-parchment">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-library-parchment border-r border-library-bronze">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 bg-library-parchment w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-library-bronze bg-library-parchment/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden border-library-bronze"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="font-display text-lg font-semibold text-library-wood">
                {navigation.find(item => item.href === location.pathname)?.name || 'Painel Administrativo'}
              </h1>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}