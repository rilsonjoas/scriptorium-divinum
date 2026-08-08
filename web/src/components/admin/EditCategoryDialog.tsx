import { useState, useEffect } from 'react';
import { Category } from '@/types';
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

interface EditCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => Promise<void>;
}

export function EditCategoryDialog({ category, open, onClose, onSave }: EditCategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      });
    } else {
      setFormData({});
    }
  }, [category]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      await onSave({
        ...formData,
        slug,
      });
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      setFormData({ ...formData, slug });
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-library-parchment border-library-bronze">
        <DialogHeader>
          <DialogTitle className="font-display text-library-wood">
            Editar Categoria
          </DialogTitle>
          <DialogDescription className="font-body text-library-bronze">
            Atualize as informações da categoria abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="name" className="font-body text-library-wood">
              Nome da Categoria *
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="font-body border-library-bronze"
            />
          </div>

          {/* Slug */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="slug" className="font-body text-library-wood">
              Slug (URL)
            </Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="categoria-slug"
              />
              <Button
                type="button"
                onClick={generateSlug}
                variant="outline"
                size="sm"
                className="border-library-bronze text-library-bronze font-body whitespace-nowrap"
              >
                Auto
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="description" className="font-body text-library-wood">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="font-body border-library-bronze min-h-[100px]"
              placeholder="Descrição da categoria..."
            />
          </div>

          {/* Book Count (read-only) */}
          <div className="grid grid-cols-1 gap-2">
            <Label className="font-body text-library-wood">
              Livros nesta categoria
            </Label>
            <Input
              value={category.bookCount || 0}
              disabled
              className="font-body border-library-bronze bg-library-gold/5"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-library-bronze text-library-bronze font-body"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !formData.name}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}