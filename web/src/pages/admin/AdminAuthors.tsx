import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthors } from '@/hooks/useDatabase';
import { Users, Plus, Search, Edit, Trash2, BookOpen, Calendar, Globe } from 'lucide-react';
import { EditAuthorDialog } from '@/components/admin/EditAuthorDialog';
import { AddAuthorDialog } from '@/components/admin/AddAuthorDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Author } from '@/types';
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

export default function AdminAuthors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: authors, isLoading, error } = useAuthors();

  const filteredAuthors = authors?.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.biography?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (authorId: string) => {
    const author = authors?.find(a => a.id === authorId);
    if (author) {
      setEditingAuthor(author);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveAuthor = async (authorData: Partial<Author>) => {
    // TODO: Implement actual save functionality with Supabase
    console.log('Saving author:', authorData);
    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setEditingAuthor(null);
  };

  const handleAddAuthor = async (authorData: Partial<Author>) => {
    // TODO: Implement actual add functionality with Supabase
    console.log('Adding author:', authorData);
    // For now, just close the dialog
    setIsAddDialogOpen(false);
  };

  const handleDelete = (authorId: string) => {
    const author = authors?.find(a => a.id === authorId);
    if (author) {
      setDeletingAuthor(author);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAuthor) return;
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual delete functionality with Supabase
      console.log('Deleting author:', deletingAuthor.id);
      // await deleteAuthor(deletingAuthor.id);
      setIsDeleteDialogOpen(false);
      setDeletingAuthor(null);
    } catch (error) {
      console.error('Error deleting author:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewBooks = (authorSlug: string) => {
    window.open(`/autores/${authorSlug}`, '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-library-wood">
              Gerenciar Autores
            </h2>
            <p className="font-body text-library-bronze mt-1">
              Administre os autores do catálogo do Scriptorium Divinum
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Autor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Total de Autores
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : authors?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Padres da Igreja
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : authors?.filter(author => author.period?.includes('Patrística') || author.name.includes('Santo') || author.name.includes('São')).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Com Biografia
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : authors?.filter(author => author.biography).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Com Links Externos
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : authors?.filter(author => author.externalLinks?.length).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-library-gold" />
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
              placeholder="Buscar autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-body border-library-bronze"
            />
          </div>
        </div>

        {/* Authors Table */}
        <Card className="border-library-bronze bg-library-parchment">
          <CardHeader>
            <CardTitle className="font-display text-library-wood flex items-center gap-2">
              <Users className="h-5 w-5 text-library-gold" />
              Catálogo de Autores
            </CardTitle>
            <CardDescription className="font-body text-library-bronze">
              {filteredAuthors.length} autores encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-body">Erro ao carregar autores: {error.message}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <p className="text-library-bronze font-body">Carregando autores...</p>
              </div>
            ) : filteredAuthors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-library-bronze mx-auto mb-4" />
                <p className="text-library-bronze font-body">
                  {searchTerm ? 'Nenhum autor encontrado para sua busca.' : 'Nenhum autor cadastrado.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body text-library-wood">Nome</TableHead>
                      <TableHead className="font-body text-library-wood">Período/Época</TableHead>
                      <TableHead className="font-body text-library-wood">Nacionalidade</TableHead>
                      <TableHead className="font-body text-library-wood">Status</TableHead>
                      <TableHead className="font-body text-library-wood text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuthors.map((author) => (
                      <TableRow key={author.id}>
                        <TableCell className="font-medium font-body text-library-wood">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-library-bronze rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-library-parchment">
                                {author.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{author.name}</p>
                              {author.originalName && (
                                <p className="text-xs text-library-bronze italic">
                                  {author.originalName}
                                </p>
                              )}
                              {author.lifespan && (
                                <p className="text-xs text-library-bronze">
                                  {author.lifespan}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-body text-library-bronze">
                          {author.period || '-'}
                        </TableCell>
                        <TableCell className="font-body text-library-bronze">
                          {author.nationality || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {author.biography && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-700 w-fit">
                                Com biografia
                              </Badge>
                            )}
                            {author.externalLinks?.length && (
                              <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 w-fit">
                                Com links
                              </Badge>
                            )}
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
                              <DropdownMenuItem onClick={() => handleViewBooks(author.slug)} className="font-body">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Ver Obras
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(author.id)} className="font-body">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(author.id)} 
                                className="text-red-600 font-body"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <EditAuthorDialog
          author={editingAuthor}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingAuthor(null);
          }}
          onSave={handleSaveAuthor}
        />

        {/* Add Dialog */}
        <AddAuthorDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddAuthor}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingAuthor(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Autor"
          description="Tem certeza que deseja excluir este autor? Esta ação removerá permanentemente o autor e pode afetar livros associados."
          itemName={deletingAuthor?.name}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}