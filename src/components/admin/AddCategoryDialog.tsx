import { useState } from 'react';
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

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (categoryData: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<void>;
}

export function AddCategoryDialog({ open, onClose, onSave }: AddCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      await onSave({
        ...formData,
        slug,
      });
      resetForm();
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-library-parchment border-library-bronze">
        <DialogHeader>
          <DialogTitle className="font-display text-library-wood">
            Adicionar Nova Categoria
          </DialogTitle>
          <DialogDescription className="font-body text-library-bronze">
            Preencha as informações da nova categoria abaixo.
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="font-body border-library-bronze"
              placeholder="Ex: Teologia Patrística, Apologética..."
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
                value={formData.slug}
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
            <p className="text-xs text-library-bronze font-body">
              Será gerado automaticamente se não preenchido
            </p>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="description" className="font-body text-library-wood">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="font-body border-library-bronze min-h-[100px]"
              placeholder="Descrição da categoria, explicando que tipo de livros ela engloba..."
            />
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
            disabled={isSaving || !formData.name}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            {isSaving ? 'Salvando...' : 'Adicionar Categoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}