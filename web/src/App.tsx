import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/AdminRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Livros from "./pages/Livros";
import Autores from "./pages/Autores";
import AutorDetalhes from "./pages/AutorDetalhes";
import Categorias from "./pages/Categorias";
import Ajuda from "./pages/Ajuda";
import DominioPublico from "./pages/DominioPublico";
import Busca from "./pages/Busca";
import Contribuir from "./pages/Contribuir";
import LivroDetalhes from "./pages/LivroDetalhes";
import CategoryPage from "./pages/CategoryPage";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";

const Reader = lazy(() => import("./pages/Reader"));

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-library-bronze border-t-library-gold" />
  </div>
);
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/livros" element={<Livros />} />
            <Route path="/livros/:bookId" element={<LivroDetalhes />} />
            <Route path="/ler/:bookId" element={<Reader />} />
            <Route path="/autores" element={<Autores />} />
            <Route path="/autores/:authorSlug" element={<AutorDetalhes />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categorias/:categorySlug" element={<CategoryPage />} />
            <Route path="/ajuda" element={<Ajuda />} />
            <Route path="/dominio-publico" element={<DominioPublico />} />
            <Route path="/busca" element={<Busca />} />
            <Route path="/contribuir" element={<Contribuir />} />
            <Route path="/sobre" element={<Sobre />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
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

            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
