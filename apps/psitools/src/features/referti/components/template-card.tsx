'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Eye, Star, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { useExportTemplates } from '@/features/referti/hook/use-export-template';
import { useFavoritesTemplates } from '@/features/referti/hook/use-favorites-templates';
import { useTRPC } from '@/trpc/react';

import { TemplatePreview } from './template-preview';

interface ApiTemplateContent {
  date?: Date;
  time?: string;
  sections?: { title?: string; description?: string }[];
  titles?: { content?: string }[];
  paragraphs?: { content?: string }[];
  attachments?: { name?: string; date?: string; type?: string }[];
  theme: {
    font: string;
    titleSize: string;
    paragraphSize: string;
    primaryColor: string;
  };
}

interface DatabaseTemplateContent {
  date?: Date | string;
  time?: string;
  sections?: { title?: string; description?: string }[];
  titles?: { content?: string }[];
  paragraphs?: { content?: string }[];
  attachments?: { name?: string; date?: string; type?: string }[];
  theme?: {
    font?: string;
    titleSize?: string;
    paragraphSize?: string;
    primaryColor?: string;
  };
}

interface Template {
  id: string;
  title: string;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const { exportTemplates } = useExportTemplates();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { favorites, toggleFavorite } = useFavoritesTemplates();
  const isFavorite = favorites.includes(template.id);

  const deleteTemplateMutation = useMutation(
    api.templates.delete.mutationOptions({
      onSuccess: async () => {
        toast.success('Modello eliminato con successo');
        await queryClient.invalidateQueries(
          api.templates.findAll.queryFilter(),
        );
      },
      onError: (error) => {
        console.error("Errore durante l'eliminazione:", error);
        toast.error("Si è verificato un errore durante l'eliminazione");
      },
    }),
  );

  const createTemplateMutation = useMutation(
    api.templates.create.mutationOptions({
      onSuccess: async () => {
        toast.success('Nuovo modello creato con successo');
        await queryClient.invalidateQueries(
          api.templates.findAll.queryFilter(),
        );
      },
      onError: (error) => {
        console.error('Errore durante la creazione:', error);
        toast.error('Si è verificato un errore durante la creazione');
      },
    }),
  );

  const handleEdit = () => {
    const basePath = pathname.replace('/modelli', '');
    router.push(`${basePath}/builder/${template.id}?type=template`);
  };

  const handlePreview = async () => {
    try {
      await exportTemplates({
        templateIds: [template.id],
        mode: 'export',
      });
    } catch (error) {
      console.error("Errore durante l'export del template:", error);
      toast.error("Errore durante l'export del template");
    }
  };
  const handleDelete = async () => {
    try {
      await deleteTemplateMutation.mutateAsync({ id: template.id });
      setShowDeleteDialog(false);
    } catch {
      console.error("Errore durante l'eliminazione del modello");
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(template.id);
  };

  const handleCreateNew = async () => {
    try {
      const newTitle = `${template.title} - Copia`;

      let apiTemplateContent: ApiTemplateContent = {
        date: new Date(),
        time: new Date().toTimeString().slice(0, 5),
        sections: [],
        titles: [],
        paragraphs: [],
        attachments: [],
        theme: {
          font: 'poppins',
          titleSize: '14',
          paragraphSize: '12',
          primaryColor: '#4F46E5',
        },
      };

      if (template.content && typeof template.content === 'object') {
        const content = template.content as DatabaseTemplateContent;

        let dateValue: Date = new Date();
        if (content.date) {
          if (typeof content.date === 'string') {
            const parsedDate = new Date(content.date);
            dateValue = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
          } else if (content.date instanceof Date) {
            dateValue = content.date;
          }
        }

        const defaultTheme = {
          font: 'poppins',
          titleSize: '14',
          paragraphSize: '12',
          primaryColor: '#4F46E5',
        };
        const theme: ApiTemplateContent['theme'] = {
          font: content.theme?.font ?? defaultTheme.font,
          titleSize: content.theme?.titleSize ?? defaultTheme.titleSize,
          paragraphSize:
            content.theme?.paragraphSize ?? defaultTheme.paragraphSize,
          primaryColor:
            content.theme?.primaryColor ?? defaultTheme.primaryColor,
        };

        apiTemplateContent = {
          date: dateValue,
          time: content.time || new Date().toTimeString().slice(0, 5),
          sections: content.sections || [],
          titles: content.titles || [],
          paragraphs: content.paragraphs || [],
          attachments: content.attachments || [],
          theme,
        };
      }

      await createTemplateMutation.mutateAsync({
        title: newTitle,
        content: apiTemplateContent,
      });
    } catch (error) {
      console.error('Errore durante la creazione del nuovo modello:', error);
      toast.error('Errore durante la creazione del nuovo modello');
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
        <TemplatePreview template={template} />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="flex-1 truncate text-lg font-semibold leading-6">
              {template.title}
            </h3>
            <Toggle
              aria-label="Aggiungi ai preferiti"
              pressed={isFavorite}
              size="sm"
              onPressedChange={() => handleToggleFavorite()}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              className="ml-2 h-8 w-10 cursor-pointer border border-primary text-base text-primary hover:bg-primary/5 [&>svg]:data-[state=on]:fill-primary [&>svg]:data-[state=on]:stroke-white"
            >
              <Star className="h-4 w-4" />
            </Toggle>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-5 gap-2">
            <Button
              onClick={handleCreateNew}
              disabled={createTemplateMutation.isPending}
              className="col-span-2"
            >
              {createTemplateMutation.isPending ? 'Creazione...' : 'Nuovo'}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              className="w-full"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePreview}
              className="w-full"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                toast('Sei sicuro di voler eliminare questo modello?', {
                  action: {
                    label: 'Conferma',
                    onClick: () => {
                      void handleDelete();
                    },
                  },
                  cancel: {
                    label: 'Annulla',
                    onClick: () => {
                      console.log('Azione annullata');
                    },
                  },
                });
              }}
              className="w-full hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              disabled={deleteTemplateMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina modello</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il modello "{template.title}"?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending ? 'Eliminazione...' : 'Elimina'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
