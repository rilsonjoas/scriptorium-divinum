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

interface AddAuthorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (authorData: {
    name: string;
    originalName?: string;
    birthYear?: number;
    deathYear?: number;
    period?: string;
    nationality?: string;
    bioSummary?: string;
    biography?: string;
    portraitImageUrl?: string;
  }) => Promise<void>;
}

export function AddAuthorDialog({ open, onClose, onSave }: AddAuthorDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    originalName: '',
    birthYear: '',
    deathYear: '',
    period: '',
    nationality: '',
    bioSummary: '',
    biography: '',
    portraitImageUrl: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      originalName: '',
      birthYear: '',
      deathYear: '',
      period: '',
      nationality: '',
      bioSummary: '',
      biography: '',
      portraitImageUrl: '',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
        deathYear: formData.deathYear ? parseInt(formData.deathYear) : undefined,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving author:', error);
    } finally {
      setIsSaving(false);
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
            Adicionar Novo Autor
          </DialogTitle>
          <DialogDescription className="font-body text-library-bronze">
            Preencha as informações do novo autor abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="name" className="font-body text-library-wood">
              Nome *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="font-body border-library-bronze"
              placeholder="Nome do autor..."
            />
          </div>

          {/* Original Name */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="originalName" className="font-body text-library-wood">
              Nome Original
            </Label>
            <Input
              id="originalName"
              value={formData.originalName}
              onChange={(e) => setFormData({ ...formData, originalName: e.target.value })}
              className="font-body border-library-bronze"
              placeholder="Nome na língua original..."
            />
          </div>

          {/* Birth and Death Years */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthYear" className="font-body text-library-wood">
                Ano de Nascimento
              </Label>
              <Input
                id="birthYear"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="Ex: 354"
              />
            </div>
            <div>
              <Label htmlFor="deathYear" className="font-body text-library-wood">
                Ano de Morte
              </Label>
              <Input
                id="deathYear"
                value={formData.deathYear}
                onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                className="font-body border-library-bronze"
                placeholder="Ex: 430"
              />
            </div>
          </div>

          {/* Period and Nationality */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period" className="font-body text-library-wood">
                Período/Época
              </Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Ex: Patrística, Medieval, Moderno"
                className="font-body border-library-bronze"
              />
            </div>
            <div>
              <Label htmlFor="nationality" className="font-body text-library-wood">
                Nacionalidade
              </Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Ex: Romano, Grego, Francês"
                className="font-body border-library-bronze"
              />
            </div>
          </div>

          {/* Bio Summary */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="bioSummary" className="font-body text-library-wood">
              Resumo Biográfico
            </Label>
            <Textarea
              id="bioSummary"
              value={formData.bioSummary}
              onChange={(e) => setFormData({ ...formData, bioSummary: e.target.value })}
              className="font-body border-library-bronze min-h-[80px]"
              placeholder="Breve resumo da vida do autor..."
            />
          </div>

          {/* Biography */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="biography" className="font-body text-library-wood">
              Biografia Completa
            </Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              className="font-body border-library-bronze min-h-[120px]"
              placeholder="Biografia detalhada do autor..."
            />
          </div>

          {/* Portrait URL */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="portraitImageUrl" className="font-body text-library-wood">
              URL da Imagem do Retrato
            </Label>
            <Input
              id="portraitImageUrl"
              type="url"
              value={formData.portraitImageUrl}
              onChange={(e) => setFormData({ ...formData, portraitImageUrl: e.target.value })}
              className="font-body border-library-bronze"
              placeholder="https://..."
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
            {isSaving ? 'Salvando...' : 'Adicionar Autor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}