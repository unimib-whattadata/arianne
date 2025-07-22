'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useExportReports } from '@/features/referti/hook/use-report-export';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

interface SaveSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Record<string, unknown>;
  isEditing?: boolean;
  reportId?: string;
  existingTitle?: string;
  patientId?: string;
  isTemplate?: boolean;
}

export function SaveSheet({
  open,
  onOpenChange,
  formData,
  isEditing = false,
  reportId,
  existingTitle = '',
  patientId,
  isTemplate = false,
}: SaveSheetProps) {
  const pathname = usePathname();
  const [exportSelected, setExportSelected] = useState(false);
  const [saveSelected, setSaveSelected] = useState(false);
  const [saveAsModelSelected, setSaveAsModelSelected] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [csvSelected, setCsvSelected] = useState(false);
  const [pdfSelected, setPdfSelected] = useState(false);

  const { patient } = usePatient();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { exportReports, exportReportsAsCSV } = useExportReports();
  const router = useRouter();

  const createReportMutation = useMutation(
    api.reports.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.reports.findMany.queryKey({
            patientId: patient?.id || '',
          }),
        });
      },
      onError: (error) => {
        console.error('Errore durante il salvataggio:', error);
        toast.error('Si è verificato un errore durante il salvataggio');
      },
    }),
  );

  const updateReportMutation = useMutation(
    api.reports.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.reports.findMany.queryKey({
            patientId: patient?.id || '',
          }),
        });
        if (reportId) {
          await queryClient.invalidateQueries({
            queryKey: api.reports.findUnique.queryKey({ id: reportId }),
          });
        }
      },
      onError: (error) => {
        console.error("Errore durante l'aggiornamento:", error);
        toast.error("Si è verificato un errore durante l'aggiornamento");
      },
    }),
  );

  const createTemplateMutation = useMutation(
    api.templates.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.templates.findAll.queryKey(),
        });
      },
      onError: (error) => {
        console.error('Errore durante il salvataggio del modello:', error);
        toast.error(
          'Si è verificato un errore durante il salvataggio del modello',
        );
      },
    }),
  );

  const updateTemplateMutation = useMutation(
    api.templates.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.templates.findAll.queryKey(),
        });
      },
      onError: (error) => {
        console.error("Errore durante l'aggiornamento del modello:", error);
        toast.error(
          "Si è verificato un errore durante l'aggiornamento del modello",
        );
      },
    }),
  );

  useEffect(() => {
    if (isEditing && existingTitle) {
      setTitle(existingTitle);
    } else if (!isEditing && existingTitle) {
      setTitle(existingTitle);
    } else {
      setTitle('');
    }

    if (open) {
      setExportSelected(false);
      setSaveSelected(false);
      setSaveAsModelSelected(isTemplate);
      setCsvSelected(false);
      setPdfSelected(true);
    }
  }, [isEditing, existingTitle, open, isTemplate]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Il titolo è obbligatorio');
      return;
    }

    const currentPatientId = patientId || patient?.id;
    const shouldSave = saveSelected || exportSelected;

    if (!currentPatientId && !isTemplate && shouldSave) {
      toast.error('Paziente non trovato');
      return;
    }

    try {
      setIsLoading(true);

      let dateValue = formData.date as Date;
      if (typeof dateValue === 'string') {
        dateValue = new Date(dateValue);
      }
      if (!dateValue || isNaN(dateValue.getTime())) {
        dateValue = new Date();
      }

      const contentData = {
        date: dateValue,
        time: (formData.time as string) || '',
        sections: structuredClone(
          (formData.sections as { title?: string; description?: string }[]) ||
            [],
        ),
        titles: structuredClone(
          (formData.titles as { content?: string }[]) || [],
        ),
        paragraphs: structuredClone(
          (formData.paragraphs as { content?: string }[]) || [],
        ),
        attachments: structuredClone(
          (formData.attachments as {
            name?: string;
            date?: string;
            type?: string;
          }[]) || [],
        ),
        theme: (() => {
          const themeData = formData.theme as
            | {
                font?: string;
                titleSize?: string;
                paragraphSize?: string;
                primaryColor?: string;
              }
            | undefined;

          if (
            themeData &&
            typeof themeData.font === 'string' &&
            themeData.font.trim() !== '' &&
            typeof themeData.titleSize === 'string' &&
            themeData.titleSize.trim() !== '' &&
            typeof themeData.paragraphSize === 'string' &&
            themeData.paragraphSize.trim() !== '' &&
            typeof themeData.primaryColor === 'string' &&
            themeData.primaryColor.trim() !== ''
          ) {
            return {
              font: themeData.font,
              titleSize: themeData.titleSize,
              paragraphSize: themeData.paragraphSize,
              primaryColor: themeData.primaryColor,
            };
          }

          return undefined;
        })(),
      };

      const promises = [];
      let saveReportPromise = null;
      let saveTemplatePromise = null;
      let savedReportId: string | null = null;

      if (shouldSave) {
        const reportData = {
          title: title,
          patientId: currentPatientId!,
          ...contentData,
        };

        if (isEditing && reportId && !isTemplate) {
          saveReportPromise = updateReportMutation.mutateAsync({
            id: reportId,
            ...reportData,
          });
          savedReportId = reportId;
        } else {
          saveReportPromise = createReportMutation.mutateAsync(reportData);
        }
        promises.push(saveReportPromise);
      }

      if (saveAsModelSelected) {
        const templateData = { title: title, content: contentData };

        if (isEditing && reportId && isTemplate) {
          saveTemplatePromise = updateTemplateMutation.mutateAsync({
            ...templateData,
            id: reportId,
          });
        } else {
          saveTemplatePromise =
            createTemplateMutation.mutateAsync(templateData);
        }
        promises.push(saveTemplatePromise);
      }

      const results = await Promise.all(promises);

      if (saveReportPromise && !savedReportId) {
        const reportResult = results.find(
          (result) => result && 'id' in result && result.id,
        );
        if (reportResult) {
          savedReportId = reportResult.id;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (shouldSave && saveAsModelSelected && !isTemplate) {
        toast.success('Referto e modello salvati con successo');
      } else if (shouldSave && !isTemplate) {
        toast.success(
          isEditing
            ? 'Referto aggiornato con successo'
            : 'Referto salvato con successo',
        );
      } else if (saveAsModelSelected) {
        toast.success(
          isEditing && isTemplate
            ? 'Modello aggiornato con successo'
            : 'Modello salvato con successo',
        );
      }

      if (exportSelected && savedReportId && !isTemplate) {
        if (!csvSelected && !pdfSelected) {
          toast.warning('Nessun formato di export selezionato');
        } else {
          try {
            if (pdfSelected) {
              await exportReports({
                reportIds: [savedReportId],
                mode: 'export',
              });
            }

            if (csvSelected) {
              await exportReportsAsCSV({
                reportData: {
                  title,
                  ...contentData,
                },
                patientName: patient?.user?.name || 'Paziente',
              });
            }
          } catch (exportError) {
            console.error("Errore durante l'export automatico:", exportError);
            toast.error("Referto salvato ma errore durante l'export");
          }
        }
      }

      onOpenChange(false);

      if (shouldSave && !isTemplate) {
        const basePath = pathname.split('/referti')[0] + '/referti';
        router.push(basePath);
      }
    } catch (error) {
      console.error(' Errore durante il salvataggio:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="mb-5">
          <div className="flex items-center justify-between">
            <SheetTitle>{isEditing ? 'Modifica Referto' : 'Salva'}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <p className="mb-2 font-medium">Titolo</p>
            <Input
              placeholder="Inserisci un titolo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-2 font-medium">Scegli un'azione</p>
            <div className="rounded-md border border-input">
              <div className="flex items-center border-b border-input px-4 py-3">
                <Checkbox
                  id="salva"
                  className="mr-2"
                  checked={saveSelected}
                  onCheckedChange={(checked) =>
                    setSaveSelected(Boolean(checked))
                  }
                />
                <Label htmlFor="salva" className="cursor-pointer">
                  {isEditing ? 'Aggiorna' : 'Salva'}{' '}
                  {isTemplate ? 'come referto' : ''}
                </Label>
              </div>

              <div className="flex items-center border-b border-input px-4 py-3">
                <Checkbox
                  id="salva-esporta"
                  className="mr-2"
                  checked={exportSelected}
                  onCheckedChange={(checked) =>
                    setExportSelected(Boolean(checked))
                  }
                />
                <Label htmlFor="salva-esporta" className="cursor-pointer">
                  Salva {isTemplate ? 'come referto' : ''} ed esporta
                </Label>
              </div>

              <div className="flex items-center px-4 py-3">
                <Checkbox
                  id="salva-modello"
                  className="mr-2"
                  checked={saveAsModelSelected}
                  onCheckedChange={(checked) =>
                    setSaveAsModelSelected(Boolean(checked))
                  }
                  disabled={isTemplate}
                />
                <Label htmlFor="salva-modello" className="cursor-pointer">
                  {isTemplate ? 'Salva modello' : 'Salva come modello'}
                </Label>
              </div>
            </div>
          </div>

          {exportSelected && !isTemplate && (
            <div>
              <p className="mb-2 font-medium">Formato di esportazione</p>
              <div className="rounded-md border border-input">
                {/* <div className="flex items-center border-b border-input px-4 py-3">
                  <Checkbox
                    id="csv"
                    className="mr-2"
                    checked={csvSelected}
                    onCheckedChange={(checked) =>
                      setCsvSelected(Boolean(checked))
                    }
                  />
                  <Label htmlFor="csv" className="cursor-pointer">
                    CSV
                  </Label>
                </div> */}
                <div className="flex items-center px-4 py-3">
                  <Checkbox
                    id="pdf"
                    className="mr-2"
                    checked={pdfSelected}
                    onCheckedChange={(checked) =>
                      setPdfSelected(Boolean(checked))
                    }
                  />
                  <Label htmlFor="pdf" className="cursor-pointer">
                    PDF
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <Button
              variant="default"
              onClick={handleSave}
              disabled={
                isLoading ||
                createReportMutation.isPending ||
                updateReportMutation.isPending ||
                createTemplateMutation.isPending ||
                updateTemplateMutation.isPending ||
                (!saveSelected && !exportSelected && !saveAsModelSelected)
              }
            >
              {isLoading ||
              createReportMutation.isPending ||
              updateReportMutation.isPending ||
              createTemplateMutation.isPending ||
              updateTemplateMutation.isPending
                ? 'Salvataggio in corso...'
                : 'Salva'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
