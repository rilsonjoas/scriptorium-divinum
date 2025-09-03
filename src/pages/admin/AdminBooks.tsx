import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBooks, useAuthors } from '@/hooks/useDatabase';
import { BookOpen, Plus, Search, Edit, Trash2, Eye, Download, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EditBookDialog } from '@/components/admin/EditBookDialog';
import { AddBookDialog } from '@/components/admin/AddBookDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Book } from '@/types';
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

export default function AdminBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: books, isLoading, error } = useBooks();
  const { data: authors } = useAuthors();

  const filteredBooks = books?.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (bookId: string) => {
    const book = books?.find(b => b.id === bookId);
    if (book) {
      setEditingBook(book);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveBook = async (bookData: Partial<Book>) => {
    // TODO: Implement actual save functionality with Supabase
    console.log('Saving book:', bookData);
    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setEditingBook(null);
  };

  const handleAddBook = async (bookData: Partial<Book>) => {
    // TODO: Implement actual add functionality with Supabase
    console.log('Adding book:', bookData);
    // For now, just close the dialog
    setIsAddDialogOpen(false);
  };

  const handleDelete = (bookId: string) => {
    const book = books?.find(b => b.id === bookId);
    if (book) {
      setDeletingBook(book);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual delete functionality with Supabase
      console.log('Deleting book:', deletingBook.id);
      // await deleteBook(deletingBook.id);
      setIsDeleteDialogOpen(false);
      setDeletingBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (bookId: string) => {
    window.open(`/livros/${bookId}`, '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-library-wood">
              Gerenciar Livros
            </h2>
            <p className="font-body text-library-bronze mt-1">
              Administre o catálogo de livros do Scriptorium Divinum
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Livro
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Total de Livros
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : books?.length || 0}
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
                    Com Download
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : books?.filter(book => book.downloadLinks?.length).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <Download className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-library-bronze font-body">
                    Leitura Online
                  </p>
                  <p className="text-3xl font-bold text-library-wood font-display">
                    {isLoading ? '...' : books?.filter(book => book.onlineReadPath).length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-library-gold/20 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-library-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-library-bronze" />
            <Input
              type="text"
              placeholder="Buscar livros ou autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-body border-library-bronze"
            />
          </div>
          <Button variant="outline" className="border-library-bronze text-library-bronze font-body">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Books Table */}
        <Card className="border-library-bronze bg-library-parchment">
          <CardHeader>
            <CardTitle className="font-display text-library-wood flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-library-gold" />
              Catálogo de Livros
            </CardTitle>
            <CardDescription className="font-body text-library-bronze">
              {filteredBooks.length} livros encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-body">Erro ao carregar livros: {error.message}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <p className="text-library-bronze font-body">Carregando livros...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-library-bronze mx-auto mb-4" />
                <p className="text-library-bronze font-body">
                  {searchTerm ? 'Nenhum livro encontrado para sua busca.' : 'Nenhum livro cadastrado.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body text-library-wood">Título</TableHead>
                      <TableHead className="font-body text-library-wood">Autor</TableHead>
                      <TableHead className="font-body text-library-wood">Categorias</TableHead>
                      <TableHead className="font-body text-library-wood">Ano</TableHead>
                      <TableHead className="font-body text-library-wood">Status</TableHead>
                      <TableHead className="font-body text-library-wood text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium font-body text-library-wood">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-library-gold" />
                            <div>
                              <p className="font-medium">{book.title}</p>
                              {book.originalTitle && (
                                <p className="text-xs text-library-bronze italic">
                                  {book.originalTitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-body text-library-bronze">
                          {book.author.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {book.categories?.slice(0, 2).map((category) => (
                              <Badge key={category} variant="outline" className="text-xs border-library-gold text-library-bronze">
                                {category}
                              </Badge>
                            ))}
                            {book.categories && book.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs border-library-bronze text-library-bronze">
                                +{book.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-body text-library-bronze">
                          {book.publicationYearOriginal || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {book.onlineReadPath && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                Online
                              </Badge>
                            )}
                            {book.downloadLinks?.length && (
                              <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">
                                Download
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
                              <DropdownMenuItem onClick={() => handleView(book.id)} className="font-body">
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(book.id)} className="font-body">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(book.id)} 
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
        <EditBookDialog
          book={editingBook}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingBook(null);
          }}
          onSave={handleSaveBook}
          authors={authors || []}
        />

        {/* Add Dialog */}
        <AddBookDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddBook}
          authors={authors || []}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingBook(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Livro"
          description="Tem certeza que deseja excluir este livro? Esta ação removerá permanentemente o livro do catálogo."
          itemName={deletingBook?.title}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}