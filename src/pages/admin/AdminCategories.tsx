import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories, useBooks } from '@/hooks/useDatabase';
import { FolderOpen, Plus, Search, Edit, Trash2, BookOpen, Tag, TrendingUp } from 'lucide-react';
import { EditCategoryDialog } from '@/components/admin/EditCategoryDialog';
import { AddCategoryDialog } from '@/components/admin/AddCategoryDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Category } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: books, isLoading: booksLoading } = useBooks();

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalBooks = books?.length || 0;
  const mostPopularCategory = categories?.reduce((max, category) => 
    (category.bookCount || 0) > (max?.bookCount || 0) ? category : max, categories?.[0] || null
  );

  const handleEdit = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory(category);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    // TODO: Implement actual save functionality with Supabase
    console.log('Saving category:', categoryData);
    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleAddCategory = async (categoryData: Partial<Category>) => {
    // TODO: Implement actual add functionality with Supabase
    console.log('Adding category:', categoryData);
    // For now, just close the dialog
    setIsAddDialogOpen(false);
  };

  const handleDelete = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    if (category) {
      setDeletingCategory(category);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual delete functionality with Supabase
      console.log('Deleting category:', deletingCategory.id);
      // await deleteCategory(deletingCategory.id);
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewBooks = (categoryName: string) => {
    window.open(`/categorias/${encodeURIComponent(categoryName)}`, '_blank');
  };

  const isLoading = categoriesLoading || booksLoading;
  const error = categoriesError;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-library-wood">
              Gerenciar Categorias
            </h2>
            <p className="font-body text-library-bronze mt-1">
              Organize e classifique o catálogo do Scriptorium Divinum
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Categoria
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Total de Categorias
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : categories?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Mais Popular
                  </p>
                  <p className="text-lg font-bold text-library-wood font-display truncate">
                    {isLoading ? '...' : mostPopularCategory?.name || '-'}
                  </p>
                  <p className="text-xs text-library-bronze font-body">
                    {mostPopularCategory?.bookCount || 0} livros
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Com Descrição
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : categories?.filter(cat => cat.description).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <Tag className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Livros Categorizados
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : books?.filter(book => book.categories?.length).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
            <Input
              type="text"
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-body border-library-bronze"
            />
          </div>
        </div>

        {/* Categories Table */}
        <Card className="border-library-bronze bg-library-parchment">
          <CardHeader>
            <CardTitle className="font-display text-library-wood flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-library-gold" />
              Catálogo de Categorias
            </CardTitle>
            <CardDescription className="font-body text-library-bronze">
              {filteredCategories.length} categorias encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-body">Erro ao carregar categorias: {error.message}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <p className="text-library-bronze font-body">Carregando categorias...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-library-bronze mx-auto mb-4" />
                <p className="text-library-bronze font-body">
                  {searchTerm ? 'Nenhuma categoria encontrada para sua busca.' : 'Nenhuma categoria cadastrada.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body text-library-wood">Nome</TableHead>
                      <TableHead className="font-body text-library-wood">Descrição</TableHead>
                      <TableHead className="font-body text-library-wood">Livros</TableHead>
                      <TableHead className="font-body text-library-wood">Popularidade</TableHead>
                      <TableHead className="font-body text-library-wood text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => {
                      const popularityPercentage = totalBooks > 0 ? ((category.bookCount || 0) / totalBooks) * 100 : 0;
                      
                      return (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium font-body text-library-wood">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-library-gold/20 rounded-full flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-library-gold" />
                              </div>
                              <div>
                                <p className="font-medium">{category.name}</p>
                                {category.slug && (
                                  <p className="text-xs text-library-bronze">
                                    /{category.slug}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-body text-library-bronze max-w-xs">
                            <p className="truncate" title={category.description}>
                              {category.description || '-'}
                            </p>
                          </TableCell>
                          <TableCell className="font-body text-library-bronze">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="border-library-gold text-library-bronze">
                                {category.bookCount || 0}
                              </Badge>
                              {(category.bookCount || 0) > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewBooks(category.name)}
                                  className="text-library-bronze hover:text-library-wood"
                                >
                                  <BookOpen className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={popularityPercentage} 
                                className="w-16 h-2" 
                              />
                              <span className="text-xs text-library-bronze font-body">
                                {popularityPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="font-body">
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(category.bookCount || 0) > 0 && (
                                  <DropdownMenuItem onClick={() => handleViewBooks(category.name)} className="font-body">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Ver Livros
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleEdit(category.id)} className="font-body">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(category.id)} 
                                  className="text-red-600 font-body"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <EditCategoryDialog
          category={editingCategory}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />

        {/* Add Dialog */}
        <AddCategoryDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddCategory}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingCategory(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Categoria"
          description="Tem certeza que deseja excluir esta categoria? Esta ação removerá permanentemente a categoria e pode afetar a classificação dos livros."
          itemName={deletingCategory?.name}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}