import { useState } from 'react';
import { Author } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AddBookDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (bookData: {
    title: string;
    originalTitle?: string;
    authorId: string;
    description: string;
    publicationYearOriginal?: string;
    publicationYearTranslation?: number;
    translator?: string;
    language: string;
    featured: boolean;
    onlineReadPath?: string;
    coverImageUrl?: string;
    categories: string[];
  }) => Promise<void>;
  authors: Author[];
}

export function AddBookDialog({ open, onClose, onSave, authors }: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    authorId: '',
    description: '',
    publicationYearOriginal: '',
    publicationYearTranslation: 0,
    translator: '',
    language: 'pt',
    featured: false,
    onlineReadPath: '',
    coverImageUrl: '',
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      originalTitle: '',
      authorId: '',
      description: '',
      publicationYearOriginal: '',
      publicationYearTranslation: 0,
      translator: '',
      language: 'pt',
      featured: false,
      onlineReadPath: '',
      coverImageUrl: '',
    });
    setCategories([]);
    setNewCategory('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        categories,
        publicationYearTranslation: formData.publicationYearTranslation || undefined,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-library-parchment border-library-bronze">
        <DialogHeader>
          <DialogTitle className="font-display text-library-wood">
            Adicionar Novo Livro
          </DialogTitle>
          <DialogDescription className="font-body text-library-bronze">
            Preencha as informações do novo livro abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="title" className="font-body text-library-wood">
              Título *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="font-body border-library-bronze"
              placeholder="Digite o título do livro..."
            />
          </div>

          {/* Original Title */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="originalTitle" className="font-body text-library-wood">
              Título Original
            </Label>
            <Input
              id="originalTitle"
              value={formData.originalTitle}
              onChange={(e) => setFormData({ ...formData, originalTitle: e.target.value })}
              className="font-body border-library-bronze"
              placeholder="Título na língua original..."
            />
          </div>

          {/* Author */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="author" className="font-body text-library-wood">
              Autor *
            </Label>
            <Select 
              value={formData.authorId} 
              onValueChange={(value) => setFormData({ ...formData, authorId: value })}
            >
              <SelectTrigger className="font-body border-library-bronze">
                <SelectValue placeholder="Selecione um autor..." />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="description" className="font-body text-library-wood">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="font-body border-library-bronze min-h-[100px]"
              placeholder="Descreva o conteúdo do livro..."
            />
          </div>

          {/* Years */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publicationYearOriginal" className="font-body text-library-wood">
                Ano da Publicação Original
              </Label>
              <Input
                id="publicationYearOriginal"
                value={formData.publicationYearOriginal}
                onChange={(e) => setFormData({ ...formData, publicationYearOriginal: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="Ex: 354 d.C."
              />
            </div>
            <div>
              <Label htmlFor="publicationYearTranslation" className="font-body text-library-wood">
                Ano da Tradução
              </Label>
              <Input
                id="publicationYearTranslation"
                type="number"
                value={formData.publicationYearTranslation || ''}
                onChange={(e) => setFormData({ ...formData, publicationYearTranslation: parseInt(e.target.value) || 0 })}
                className="font-body border-library-bronze"
                placeholder="Ex: 2020"
              />
            </div>
          </div>

          {/* Translator and Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="translator" className="font-body text-library-wood">
                Tradutor
              </Label>
              <Input
                id="translator"
                value={formData.translator}
                onChange={(e) => setFormData({ ...formData, translator: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="Nome do tradutor..."
              />
            </div>
            <div>
              <Label htmlFor="language" className="font-body text-library-wood">
                Idioma *
              </Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="font-body border-library-bronze">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">Inglês</SelectItem>
                  <SelectItem value="la">Latim</SelectItem>
                  <SelectItem value="es">Espanhol</SelectItem>
                  <SelectItem value="fr">Francês</SelectItem>
                  <SelectItem value="de">Alemão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 gap-2">
            <Label className="font-body text-library-wood">Categorias</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-body border-library-bronze"
              />
              <Button 
                type="button" 
                onClick={addCategory}
                variant="outline"
                className="border-library-bronze text-library-bronze font-body"
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant="outline" 
                  className="border-library-gold text-library-bronze"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="coverImageUrl" className="font-body text-library-wood">
                URL da Capa
              </Label>
              <Input
                id="coverImageUrl"
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="onlineReadPath" className="font-body text-library-wood">
                Caminho para Leitura Online
              </Label>
              <Input
                id="onlineReadPath"
                value={formData.onlineReadPath}
                onChange={(e) => setFormData({ ...formData, onlineReadPath: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="/ler/livro-slug"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured" className="font-body text-library-wood">
              Livro em Destaque
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-library-bronze text-library-bronze font-body"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !formData.title || !formData.description || !formData.language || !formData.authorId}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            {isSaving ? 'Salvando...' : 'Adicionar Livro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}