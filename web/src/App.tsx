import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import Livros from "./pages/Livros";
import Autores from "./pages/Autores";
import Categorias from "./pages/Categorias";
import Ajuda from "./pages/Ajuda";
import DominioPublico from "./pages/DominioPublico";
import Busca from "./pages/Busca";
import Contribuir from "./pages/Contribuir";
import LivroDetalhes from "./pages/LivroDetalhes";
import CategoryPage from "./pages/CategoryPage";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDebug from "./pages/admin/AdminDebug";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTest from "./pages/admin/AdminTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/livros" element={<Livros />} />
            <Route path="/livros/:bookId" element={<LivroDetalhes />} />
            <Route path="/autores" element={<Autores />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categorias/:categorySlug" element={<CategoryPage />} />
            <Route path="/ajuda" element={<Ajuda />} />
            <Route path="/dominio-publico" element={<DominioPublico />} />
            <Route path="/busca" element={<Busca />} />
            <Route path="/contribuir" element={<Contribuir />} />
            <Route path="/sobre" element={<Sobre />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/debug" element={<AdminDebug />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/livros" element={
              <AdminRoute>
                <AdminBooks />
              </AdminRoute>
            } />
            <Route path="/admin/autores" element={
              <AdminRoute>
                <AdminAuthors />
              </AdminRoute>
            } />
            <Route path="/admin/categorias" element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            } />
            <Route path="/admin/configuracoes" element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } />
            <Route path="/admin/test" element={
              <AdminRoute>
                <AdminTest />
              </AdminRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
