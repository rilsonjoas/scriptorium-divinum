import { DownloadLink, BookFormat } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

const FORMATS: BookFormat[] = ['pdf', 'epub', 'mobi', 'txt', 'online'];

interface DownloadLinksEditorProps {
  value: DownloadLink[];
  onChange: (links: DownloadLink[]) => void;
}

function emptyLink(): DownloadLink {
  return { format: 'pdf', url: '' };
}

export function DownloadLinksEditor({ value, onChange }: DownloadLinksEditorProps) {
  const updateLink = (index: number, patch: Partial<DownloadLink>) => {
    const next = value.map((link, i) => (i === index ? { ...link, ...patch } : link));
    onChange(next);
  };

  const addLink = () => {
    onChange([...value, emptyLink()]);
  };

  const removeLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="flex items-center justify-between">
        <Label className="font-body text-library-wood">Links de Download</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLink}
          className="border-library-bronze text-library-bronze font-body"
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-sm font-body text-library-bronze/70">
          Nenhum link cadastrado. Adicione formatos (PDF, EPUB, MOBI, TXT ou leitura online).
        </p>
      )}

      {value.map((link, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 rounded-md border border-library-bronze/40 p-3"
        >
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="font-body text-library-wood">Formato</Label>
              <Select
                value={link.format}
                onValueChange={(format: BookFormat) => updateLink(index, { format })}
              >
                <SelectTrigger className="font-body border-library-bronze">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-library-wood">Fonte</Label>
              <Input
                value={link.source || ''}
                onChange={(e) => updateLink(index, { source: e.target.value })}
                placeholder="Ex.: Gutenberg, Monergismo"
                className="font-body border-library-bronze"
              />
            </div>
            <div>
              <Label className="font-body text-library-wood">Tamanho (bytes)</Label>
              <Input
                type="number"
                min="0"
                value={link.fileSize || ''}
                onChange={(e) =>
                  updateLink(index, { fileSize: parseInt(e.target.value) || undefined })
                }
                placeholder="Opcional"
                className="font-body border-library-bronze"
              />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
            <div>
              <Label className="font-body text-library-wood">URL</Label>
              <Input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(index, { url: e.target.value })}
                placeholder="https://..."
                className="font-body border-library-bronze"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLink(index)}
              className="text-red-600 hover:text-red-700 mt-6"
              aria-label="Remover link"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
