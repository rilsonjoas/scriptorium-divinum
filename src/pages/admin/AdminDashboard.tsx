import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooks, useAuthors, useCategories } from '@/hooks/useDatabase';
import { BookOpen, Users, FolderOpen, TrendingUp, Clock, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: authors, isLoading: authorsLoading } = useAuthors();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const totalBooks = books?.length || 0;
  const totalAuthors = authors?.length || 0;
  const totalCategories = categories?.length || 0;

  // Recent books (last 5)
  const recentBooks = books?.slice(-5) || [];

  const stats = [
    {
      name: 'Total de Livros',
      value: totalBooks,
      icon: BookOpen,
      change: '+12%',
      changeType: 'positive',
      description: 'nos últimos 30 dias',
    },
    {
      name: 'Total de Autores',
      value: totalAuthors,
      icon: Users,
      change: '+5%',
      changeType: 'positive',
      description: 'nos últimos 30 dias',
    },
    {
      name: 'Categorias',
      value: totalCategories,
      icon: FolderOpen,
      change: '0%',
      changeType: 'neutral',
      description: 'nenhuma alteração',
    },
    {
      name: 'Visualizações',
      value: '12.5k',
      icon: Eye,
      change: '+25%',
      changeType: 'positive',
      description: 'este mês',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="font-display text-3xl font-bold text-library-wood mb-2">
            Dashboard Administrativo
          </h2>
          <p className="font-body text-library-bronze">
            Visão geral do catálogo e atividades recentes do Scriptorium Divinum.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-library-bronze bg-library-parchment">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-library-bronze font-body">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-library-wood font-display">
                      {booksLoading || authorsLoading || categoriesLoading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-library-gold" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  }`} />
                  <span className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-library-bronze ml-1 font-body">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Books */}
          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <CardTitle className="font-display text-library-wood flex items-center gap-2">
                <Clock className="h-5 w-5 text-library-gold" />
                Livros Recentes
              </CardTitle>
              <CardDescription className="font-body text-library-bronze">
                Últimas adições ao catálogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {booksLoading ? (
                <p className="text-library-bronze font-body">Carregando...</p>
              ) : recentBooks.length > 0 ? (
                <div className="space-y-4">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center space-x-3 p-3 rounded-lg bg-library-gold/5">
                      <div className="w-12 h-16 bg-library-bronze rounded flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-library-parchment" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-library-wood truncate font-body">
                          {book.title}
                        </p>
                        <p className="text-sm text-library-bronze font-body">
                          {book.author.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-library-bronze font-body">Nenhum livro encontrado.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <CardTitle className="font-display text-library-wood">
                Ações Rápidas
              </CardTitle>
              <CardDescription className="font-body text-library-bronze">
                Gerenciar o catálogo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center p-4 rounded-lg border border-library-bronze hover:bg-library-gold/5 transition-colors text-left">
                  <BookOpen className="h-5 w-5 text-library-gold mr-3" />
                  <div>
                    <p className="font-medium text-library-wood font-body">Adicionar Livro</p>
                    <p className="text-sm text-library-bronze font-body">Cadastrar nova obra no catálogo</p>
                  </div>
                </button>
                
                <button className="flex items-center p-4 rounded-lg border border-library-bronze hover:bg-library-gold/5 transition-colors text-left">
                  <Users className="h-5 w-5 text-library-gold mr-3" />
                  <div>
                    <p className="font-medium text-library-wood font-body">Adicionar Autor</p>
                    <p className="text-sm text-library-bronze font-body">Cadastrar novo autor</p>
                  </div>
                </button>
                
                <button className="flex items-center p-4 rounded-lg border border-library-bronze hover:bg-library-gold/5 transition-colors text-left">
                  <FolderOpen className="h-5 w-5 text-library-gold mr-3" />
                  <div>
                    <p className="font-medium text-library-wood font-body">Gerenciar Categorias</p>
                    <p className="text-sm text-library-bronze font-body">Organizar classificações</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}