'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTRPC } from '@/trpc/react';

interface ThemeSettings {
  font: string;
  titleSize: string;
  paragraphSize: string;
  primaryColor: string;
}

interface PaletteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId?: string;
  templateId?: string;
  isTemplate?: boolean;
  currentTheme?: ThemeSettings;
  onThemeChange?: (theme: ThemeSettings) => void;

  currentFormData?: Record<string, unknown>;
}

const defaultTheme: ThemeSettings = {
  font: 'poppins',
  titleSize: '14',
  paragraphSize: '12',
  primaryColor: '#99B7DE',
};

const colorOptions = [
  '#99B7DE',
  '#000000',
  '#4169E1',
  '#6B7280',
  '#6e6ed2',
  '#bb0c0c',
  '#944812',
  '#7b1e1e',
  '#1746a3',
  '#88ba1c',
];

export function PaletteSheet({
  open,
  onOpenChange,
  reportId,
  templateId,
  isTemplate = false,
  currentTheme,
  onThemeChange,
  currentFormData,
}: PaletteSheetProps) {
  const [theme, setTheme] = useState<ThemeSettings>(
    currentTheme || defaultTheme,
  );
  const [isLoading, setIsLoading] = useState(false);

  const api = useTRPC();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme]);

  const updateReportThemeMutation = useMutation(
    api.reports.updateTheme.mutationOptions({
      onSuccess: () => {
        toast.success('Tema del referto salvato con successo');
        void queryClient.invalidateQueries(
          api.reports.findUnique.queryFilter(),
        );
        onOpenChange(false);
      },
      onError: (error) => {
        console.error('Errore durante il salvataggio del tema:', error);
        toast.error('Errore durante il salvataggio del tema');
      },
    }),
  );

  const updateReportContentMutation = useMutation(
    api.reports.update.mutationOptions({
      onSuccess: () => {
        toast.success('Tema del referto salvato con successo');
        void queryClient.invalidateQueries(
          api.reports.findUnique.queryFilter(),
        );
        onOpenChange(false);
      },
      onError: (error) => {
        console.error('Errore durante il salvataggio:', error);
        toast.error('Errore durante il salvataggio');
      },
    }),
  );

  const updateTemplateThemeMutation = useMutation(
    api.templates.updateTheme.mutationOptions({
      onSuccess: () => {
        toast.success('Tema del modello salvato con successo');
        void queryClient.invalidateQueries(
          api.templates.findUnique.queryFilter(),
        );
        onOpenChange(false);
      },
      onError: (error) => {
        console.error('Errore durante il salvataggio del tema:', error);
        toast.error('Errore durante il salvataggio del tema');
      },
    }),
  );

  const handleThemeChange = (key: keyof ThemeSettings, value: string) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const handleSave = async () => {
    if (!reportId && !templateId) {
      onThemeChange?.(theme);
      toast.success('Tema aggiornato con successo');
      onOpenChange(false);
      return;
    }

    try {
      setIsLoading(true);

      const validTheme = {
        font: theme.font || 'poppins',
        titleSize: theme.titleSize || '14',
        paragraphSize: theme.paragraphSize || '12',
        primaryColor: theme.primaryColor || '#99B7DE',
      };

      if (isTemplate && templateId) {
        await updateTemplateThemeMutation.mutateAsync({
          id: templateId,
          theme: validTheme,
        });
      } else if (!isTemplate && reportId) {
        if (currentFormData) {
          const completeData = {
            id: reportId,
            title:
              (currentFormData.titleField as string) || 'Referto senza titolo',
            date: (currentFormData.date as Date) || new Date(),
            time: (currentFormData.time as string) || '',
            sections:
              (currentFormData.sections as {
                title?: string;
                description?: string;
              }[]) || [],
            titles: (currentFormData.titles as { content?: string }[]) || [],
            paragraphs:
              (currentFormData.paragraphs as { content?: string }[]) || [],
            attachments:
              (currentFormData.attachments as {
                name?: string;
                date?: string;
                type?: string;
              }[]) || [],
            theme: validTheme,
            patientId: 'current-patient-id',
          };

          await updateReportContentMutation.mutateAsync(completeData);
        } else {
          await updateReportThemeMutation.mutateAsync({
            id: reportId,
            theme: validTheme,
          });
        }
      } else {
        console.error('Configurazione non valida:', {
          isTemplate,
          templateId,
          reportId,
        });
        toast.error('Errore nella configurazione del salvataggio');
        return;
      }

      onThemeChange?.(validTheme);
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentTheme) {
      setTheme(currentTheme);
      onThemeChange?.(currentTheme);
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="mb-5">
          <div className="flex items-center justify-between">
            <SheetTitle>Aspetto</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <p className="mb-2 font-medium">Font</p>
            <Select
              value={theme.font}
              onValueChange={(value) => handleThemeChange('font', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="lora">Lora</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="times">Times New Roman</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-4 font-medium">Dimensione</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-sm">Titolo</p>
                <Select
                  value={theme.titleSize}
                  onValueChange={(value) =>
                    handleThemeChange('titleSize', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-2 text-sm">Paragrafo</p>
                <Select
                  value={theme.paragraphSize}
                  onValueChange={(value) =>
                    handleThemeChange('paragraphSize', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 font-medium">Colore</p>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`h-8 w-8 cursor-pointer rounded-full border-2 ${
                    theme.primaryColor === color
                      ? 'border-slate-900 ring-2 ring-slate-300'
                      : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleThemeChange('primaryColor', color)}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-2 pt-4">
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={
                isLoading ||
                updateReportThemeMutation.isPending ||
                updateTemplateThemeMutation.isPending ||
                updateReportContentMutation.isPending
              }
            >
              {isLoading ||
              updateReportThemeMutation.isPending ||
              updateTemplateThemeMutation.isPending ||
              updateReportContentMutation.isPending
                ? 'Salvataggio...'
                : 'Salva'}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCancel}>
              Annulla
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
