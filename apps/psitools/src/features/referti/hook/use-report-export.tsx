'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

interface PreviewFormData {
  titleField?: string;
  date: Date;
  time: string;
  sections: {
    title?: string;
    description?: string;
  }[];
  titles: { content?: string }[];
  paragraphs: { content?: string }[];
  attachments: {
    id?: string;
    name?: string;
    date?: string;
    type?: string;
  }[];
  theme?: {
    font: string;
    titleSize: string;
    paragraphSize: string;
    primaryColor: string;
  };
}

interface ReportDataForCSV {
  title: string;
  date: Date;
  time: string;
  sections: { title?: string; description?: string }[];
  titles: { content?: string }[];
  paragraphs: { content?: string }[];
  attachments: { name?: string; date?: string; type?: string; id?: string }[];
  theme?: {
    font: string;
    titleSize: string;
    paragraphSize: string;
    primaryColor: string;
  };
}

interface CognitiveBehavioralDiaryContent {
  place?: string;
  company?: string;
  companyPerson?: string;
  context?: string;
  emotion?: string;
  thought?: string;
  bheavior?: string;
  intensity?: number;
  momentDay?: string;
  unpleasant?: string;
  bodyEmotion?: string;
  bodyFeeling?: string;
  description?: string;
  note?: string;
}

interface ABCDiaryContent {
  a?: string;
  b?: string;
  c?: string;
  note?: string;
}

interface FoodDiaryContent {
  meal?: string;
  time?: string;
  food?: string;
  place?: string;
  company?: string;
  emotion?: string;
  behavior?: string;
  note?: string;
}

interface SleepDiaryContent {
  bedTime?: string;
  sleepTime?: string;
  nightWakes?: string;
  wakeTime?: string;
  getUpTime?: string;
  sleepQuality?: string;
  note?: string;
}

export function useExportReports() {
  const [isExporting, setIsExporting] = useState(false);
  const { patient } = usePatient();
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: exportPDFMutation } = useMutation(
    api.reports.exportPDF.mutationOptions({
      onError: (error) => {
        console.error('Errore durante la generazione del PDF:', error);
        toast.error('Errore durante la generazione del PDF');
        setIsExporting(false);
      },
    }),
  );

  const { mutateAsync: createReportMutation } = useMutation(
    api.reports.create.mutationOptions({
      onError: (error) => {
        console.error(
          'Errore durante la creazione del referto temporaneo:',
          error,
        );
      },
    }),
  );

  const { mutateAsync: deleteReportMutation } = useMutation(
    api.reports.delete.mutationOptions({
      onError: (error) => {
        console.error(
          "Errore durante l'eliminazione del referto temporaneo:",
          error,
        );
      },
    }),
  );

  const exportReportsAsCSV = async ({
    reportData,
    patientName,
  }: {
    reportData: ReportDataForCSV;
    patientName: string;
  }) => {
    try {
      setIsExporting(true);

      const administrationIds: string[] = [];
      const diaryIds: string[] = [];
      const noteIds: string[] = [];

      reportData.attachments?.forEach((attachment) => {
        if (attachment.type === 'Somministrazioni' && attachment.id) {
          administrationIds.push(attachment.id);
        }
        if (attachment.type === 'Diari' && attachment.id) {
          diaryIds.push(attachment.id);
        }
        if (attachment.type === 'Note' && attachment.id) {
          noteIds.push(attachment.id);
        }
      });

      interface AdministrationAttachment {
        id: string;
        type: string;
        response: unknown;
        T: string;
        date: string;
        notes: string;
        mode: string;
      }
      let administrationAttachments: AdministrationAttachment[] = [];
      let diaryAttachments: {
        id: string;
        type: string;
        content:
          | CognitiveBehavioralDiaryContent
          | ABCDiaryContent
          | FoodDiaryContent
          | SleepDiaryContent
          | Record<string, unknown>;
        date: string;
      }[] = [];
      interface NoteAttachment {
        id: string;
        title: string;
        content: unknown;
        createdAt: string;
      }
      let noteAttachments: NoteAttachment[] = [];

      if (administrationIds.length > 0) {
        try {
          const adminPromises = administrationIds.map((id) =>
            queryClient.fetchQuery(
              api.administration.findUnique.queryOptions(
                { where: { id } },
                {
                  staleTime: 1000 * 60 * 5,
                },
              ),
            ),
          );
          const adminResults = await Promise.all(adminPromises);

          administrationAttachments = adminResults.map((result) => ({
            id: result.administration.id,
            type: result.administration.type,
            response: result.administration.records,
            T: result.administration.T?.toString() || '0',
            date: new Date(result.administration.date).toLocaleDateString(
              'it-IT',
            ),
            notes: '',
            mode:
              result.administration.modality === 'autonoma_presenza'
                ? 'Autonoma presenza'
                : result.administration.modality === 'intervista'
                  ? 'Intervista'
                  : result.administration.modality === 'accompagnatore'
                    ? 'Accompagnatore'
                    : 'Digitale',
          }));
        } catch (error) {
          console.error('Errore nel recupero delle somministrazioni:', error);
        }
      }

      if (diaryIds.length > 0) {
        try {
          const diaryPromises = diaryIds.map(async (id) => {
            try {
              const diary = await queryClient.fetchQuery(
                api.diary.findById.queryOptions({ id }),
              );

              if (diary) {
                return diary;
              } else {
                return null;
              }
            } catch (error) {
              console.error(`Errore nel recupero del diario ${id}:`, error);
              return null;
            }
          });

          const diaryResults = await Promise.all(diaryPromises);

          diaryAttachments = diaryResults
            .filter((result) => result !== null)
            .map((diary) => ({
              id: diary.id,
              type: diary.type,
              content: diary.content as
                | CognitiveBehavioralDiaryContent
                | ABCDiaryContent
                | FoodDiaryContent
                | SleepDiaryContent
                | Record<string, unknown>,
              date: diary.date,
            }));
        } catch (error) {
          console.error('Errore nel recupero dei diari:', error);
        }
      }

      if (noteIds.length > 0) {
        try {
          const notePromises = noteIds.map((id) =>
            queryClient.fetchQuery(
              api.note.findUnique.queryOptions(
                { id },
                {
                  staleTime: 1000 * 60 * 5,
                },
              ),
            ),
          );
          const noteResults = await Promise.all(notePromises);

          noteAttachments = noteResults.map((note) => ({
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt:
              typeof note.date === 'string'
                ? note.date
                : note.date.toISOString(),
          }));
        } catch (error) {
          console.error('Errore nel recupero delle note:', error);
        }
      }

      const escapeCSV = (value: string | null | undefined) => {
        if (!value) return '""';
        const stringValue = String(value).replace(/<\/?[^>]+(>|$)/g, '');
        if (
          stringValue.includes('"') ||
          stringValue.includes(',') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return `"${stringValue}"`;
      };

      let csvContent = 'data:text/csv;charset=utf-8,';

      csvContent += 'Campo,Valore\n';

      csvContent += `Titolo,${escapeCSV(reportData.title)}\n`;
      csvContent += `Data,${escapeCSV(reportData.date.toLocaleDateString('it-IT'))}\n`;
      csvContent += `Ora,${escapeCSV(reportData.time)}\n`;
      csvContent += `Paziente,${escapeCSV(patientName)}\n`;

      csvContent += '\n';

      if (reportData.sections && reportData.sections.length > 0) {
        csvContent += 'SEZIONI\n';
        csvContent += 'Titolo Sezione,Descrizione Sezione\n';
        reportData.sections.forEach((section, index) => {
          csvContent += `${escapeCSV(section.title || `Sezione ${index + 1}`)},${escapeCSV(section.description || '')}\n`;
        });
        csvContent += '\n';
      }

      if (reportData.titles && reportData.titles.length > 0) {
        csvContent += 'TITOLI\n';
        csvContent += 'Contenuto\n';
        reportData.titles.forEach((title) => {
          csvContent += `${escapeCSV(title.content || '')}\n`;
        });
        csvContent += '\n';
      }

      if (reportData.paragraphs && reportData.paragraphs.length > 0) {
        csvContent += 'PARAGRAFI\n';
        csvContent += 'Contenuto\n';
        reportData.paragraphs.forEach((paragraph) => {
          csvContent += `${escapeCSV(paragraph.content || '')}\n`;
        });
        csvContent += '\n';
      }

      if (reportData.attachments && reportData.attachments.length > 0) {
        csvContent += 'ALLEGATI\n';
        csvContent += '\n';

        if (administrationAttachments.length > 0) {
          csvContent += 'SOMMINISTRAZIONI\n';
          csvContent += 'Nome,Data,Modalità,T,Tipo,Risposte\n';

          administrationAttachments.forEach((admin) => {
            const attachmentInfo = reportData.attachments?.find(
              (att) => att.id === admin.id,
            );

            let formattedResponses = '';
            if (admin.response && typeof admin.response === 'object') {
              try {
                formattedResponses = Object.entries(admin.response)
                  .map(([key, value]) => {
                    let cleanValue = '';
                    if (typeof value === 'string') {
                      cleanValue = value.replace(/<\/?[^>]+(>|$)/g, '');
                    } else if (typeof value === 'object' && value !== null) {
                      const jsonString = JSON.stringify(value);
                      cleanValue = jsonString.replace(/<\/?[^>]+(>|$)/g, '');
                    } else {
                      cleanValue = String(value);
                    }
                    return `${key}: ${cleanValue}`;
                  })
                  .filter((item) => item.split(': ')[1].trim() !== '')
                  .join(' | ');
              } catch (error) {
                console.error(
                  'Errore nella formattazione delle risposte:',
                  error,
                );
                formattedResponses = JSON.stringify(admin.response).replace(
                  /<\/?[^>]+(>|$)/g,
                  '',
                );
              }
            } else {
              formattedResponses = '';
            }

            csvContent += `${escapeCSV(attachmentInfo?.name || admin.type)},${escapeCSV(admin.date)},${escapeCSV(admin.mode)},${escapeCSV(admin.T)},${escapeCSV(admin.type)},${escapeCSV(formattedResponses)}\n`;
          });
          csvContent += '\n';
        }

        if (diaryAttachments.length > 0) {
          csvContent += 'DIARI\n';
          csvContent += 'Nome,Data,Tipo,Dettagli\n';

          diaryAttachments.forEach((diary) => {
            const attachmentInfo = reportData.attachments?.find(
              (att) => att.id === diary.id,
            );

            const content = diary.content || {};
            let formattedContent = '';

            if (diary.type === 'cognitive_beahvioral') {
              const typedContent = content as CognitiveBehavioralDiaryContent;
              formattedContent = [
                `Luogo: ${typedContent.place?.replace(/<\/?p>/g, '') || ''}`,
                `In compagnia: ${typedContent.company || ''}`,
                `Persona: ${typedContent.companyPerson?.replace(/<\/?p>/g, '') || ''}`,
                `Contesto: ${typedContent.context?.replace(/<\/?p>/g, '') || ''}`,
                `Emozione: ${typedContent.emotion?.replace(/<\/?p>/g, '') || ''}`,
                `Pensiero: ${typedContent.thought?.replace(/<\/?p>/g, '') || ''}`,
                `Comportamento: ${typedContent.bheavior?.replace(/<\/?p>/g, '') || ''}`,
                `Intensità: ${typedContent.intensity || ''}`,
                `Momento della giornata: ${typedContent.momentDay || ''}`,
                `Sensazione spiacevole: ${typedContent.unpleasant?.replace(/<\/?p>/g, '') || ''}`,
                `Emozione corporea: ${typedContent.bodyEmotion || ''}`,
                `Sensazione corporea: ${typedContent.bodyFeeling?.replace(/<\/?p>/g, '') || ''}`,
                `Descrizione: ${typedContent.description?.replace(/<\/?p>/g, '') || ''}`,
                `Note: ${typedContent.note?.replace(/<\/?p>/g, '') || ''}`,
              ].join(' | ');
            } else if (diary.type === 'abc') {
              const typedContent = content as ABCDiaryContent;
              formattedContent = [
                `A (Antecedente): ${typedContent.a?.replace(/<\/?p>/g, '') || ''}`,
                `B (Comportamento): ${typedContent.b?.replace(/<\/?p>/g, '') || ''}`,
                `C (Conseguenza): ${typedContent.c?.replace(/<\/?p>/g, '') || ''}`,
                `Note: ${typedContent.note?.replace(/<\/?p>/g, '') || ''}`,
              ].join(' | ');
            } else if (diary.type === 'food') {
              const typedContent = content as FoodDiaryContent;
              formattedContent = [
                `Pasto: ${typedContent.meal || ''}`,
                `Ora: ${typedContent.time || ''}`,
                `Alimenti: ${typedContent.food?.replace(/<\/?p>/g, '') || ''}`,
                `Luogo: ${typedContent.place?.replace(/<\/?p>/g, '') || ''}`,
                `In compagnia: ${typedContent.company || ''}`,
                `Emozioni: ${typedContent.emotion?.replace(/<\/?p>/g, '') || ''}`,
                `Comportamenti: ${typedContent.behavior?.replace(/<\/?p>/g, '') || ''}`,
                `Note: ${typedContent.note?.replace(/<\/?p>/g, '') || ''}`,
              ].join(' | ');
            } else if (diary.type === 'sleep') {
              const typedContent = content as SleepDiaryContent;
              formattedContent = [
                `Ora di coricamento: ${typedContent.bedTime || ''}`,
                `Ora di addormentamento: ${typedContent.sleepTime || ''}`,
                `Risvegli notturni: ${typedContent.nightWakes || ''}`,
                `Ora di risveglio: ${typedContent.wakeTime || ''}`,
                `Ora di alzata: ${typedContent.getUpTime || ''}`,
                `Qualità del sonno: ${typedContent.sleepQuality || ''}`,
                `Note: ${typedContent.note?.replace(/<\/?p>/g, '') || ''}`,
              ].join(' | ');
            } else {
              formattedContent = Object.entries(content)
                .map(([key, value]) => {
                  const cleanValue =
                    typeof value === 'string'
                      ? value.replace(/<\/?p>/g, '')
                      : String(value);
                  return `${key}: ${cleanValue}`;
                })
                .join(' | ');
            }

            csvContent += `${escapeCSV(attachmentInfo?.name || diary.type)},${escapeCSV(diary.date)},${escapeCSV(diary.type)},${escapeCSV(formattedContent)}\n`;
          });
          csvContent += '\n';
        }

        if (noteAttachments.length > 0) {
          csvContent += 'NOTE\n';
          csvContent += 'Titolo,Data Creazione,Contenuto\n';

          noteAttachments.forEach((note) => {
            const formattedDate = new Date(note.createdAt).toLocaleDateString(
              'it-IT',
            );
            const cleanContent =
              typeof note.content === 'string'
                ? note.content.replace(/<\/?p>/g, '')
                : note.content;

            csvContent += `${escapeCSV(note.title)},${escapeCSV(formattedDate)},${escapeCSV(cleanContent as string)}\n`;
          });
          csvContent += '\n';
        }

        const baseAttachments = reportData.attachments.filter(
          (attachment) =>
            !administrationIds.includes(attachment.id || '') &&
            !diaryIds.includes(attachment.id || '') &&
            !noteIds.includes(attachment.id || ''),
        );

        if (baseAttachments.length > 0) {
          csvContent += 'ALTRI ALLEGATI\n';
          csvContent += 'Nome,Data,Tipo\n';
          baseAttachments.forEach((attachment) => {
            csvContent += `${escapeCSV(attachment.name || '')},${escapeCSV(attachment.date || '')},${escapeCSV(attachment.type || '')}\n`;
          });
        }
      } else {
        csvContent += 'Nessun allegato presente\n';
      }

      const blob = new Blob(
        [csvContent.replace('data:text/csv;charset=utf-8,', '')],
        {
          type: 'text/csv;charset=utf-8;',
        },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `referto_${patientName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('CSV scaricato con successo');

      return Promise.resolve();
    } catch (error) {
      console.error('Errore durante la generazione del CSV:', error);
      toast.error('Errore durante la generazione del CSV');
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportReports = async ({
    reportIds,
    mode = 'export',
  }: {
    reportIds: string[];
    mode?: 'export' | 'print';
  }) => {
    if (!patient) {
      toast.error('Paziente non trovato');
      return;
    }

    if (reportIds.length === 0) {
      toast.error(
        `Seleziona almeno un referto da ${mode === 'print' ? 'stampare' : 'esportare'}`,
      );
      return;
    }

    try {
      setIsExporting(true);

      const result = await exportPDFMutation({
        reportIds,
        patientId: patient.id,
        patient: {
          name: patient.user?.name || '',
          dateOfBirth: patient.medicalRecord?.birthDate
            ? typeof patient.medicalRecord.birthDate === 'string'
              ? patient.medicalRecord.birthDate
              : patient.medicalRecord.birthDate.toISOString().split('T')[0]
            : '',
          Gender: patient.medicalRecord?.gender || '',
          ID: patient.id,
        },
      });

      if (result.success && result.pdf) {
        const pdfBytes = new Uint8Array(result.pdf);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        if (mode === 'print') {
          const url = URL.createObjectURL(blob);
          const printWindow = window.open(url, '_blank');

          if (printWindow) {
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print();
                setTimeout(() => {
                  URL.revokeObjectURL(url);
                }, 1000);
              }, 500);
            };
          } else {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.click();
            URL.revokeObjectURL(url);
            toast.info(
              'PDF aperto in una nuova scheda. Usa Ctrl+P per stampare.',
            );
          }

          toast.success('PDF preparato per la stampa');
        } else {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `referti_${patient.user?.name}_${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('PDF scaricato con successo');
        }
      } else {
        throw new Error('Errore nella generazione del PDF');
      }
    } catch (error) {
      console.error(
        `Errore durante ${mode === 'print' ? 'la stampa' : "l'export"}:`,
        error,
      );
      toast.error(
        `Errore durante ${mode === 'print' ? 'la stampa' : "l'export"}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  const previewFromBuilder = async (formData: PreviewFormData) => {
    if (!patient) {
      toast.error('Paziente non trovato');
      return;
    }

    let tempReportId: string | null = null;

    try {
      setIsExporting(true);

      const tempReport = await createReportMutation({
        title: `[PREVIEW] ${formData.titleField || 'Anteprima Referto'}`,
        date: formData.date,
        time: formData.time,
        sections: formData.sections || [],
        titles: formData.titles || [],
        paragraphs: formData.paragraphs || [],
        attachments: formData.attachments || [],
        theme: formData.theme || {
          font: 'poppins',
          titleSize: '14',
          paragraphSize: '12',
          primaryColor: '#99B7DE',
        },
        patientId: patient.id,
      });

      tempReportId = tempReport.id;

      const result = await exportPDFMutation({
        reportIds: [tempReportId],
        patientId: patient.id,
        patient: {
          name: patient.user?.name || '',
          dateOfBirth: patient.medicalRecord?.birthDate
            ? typeof patient.medicalRecord.birthDate === 'string'
              ? patient.medicalRecord.birthDate
              : patient.medicalRecord.birthDate.toISOString().split('T')[0]
            : '',
          Gender: patient.medicalRecord?.gender || '',
          ID: patient.id,
        },
      });

      if (result.success && result.pdf) {
        const pdfBytes = new Uint8Array(result.pdf);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const previewWindow = window.open(url, '_blank');

        if (!previewWindow) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();
          URL.revokeObjectURL(url);
        }

        toast.success('Anteprima aperta con successo');
      } else {
        throw new Error("Errore nella generazione dell'anteprima");
      }
    } catch (error) {
      console.error("Errore durante la generazione dell'anteprima:", error);
      toast.error("Errore durante la generazione dell'anteprima");
    } finally {
      if (tempReportId) {
        try {
          await deleteReportMutation({ id: tempReportId });
        } catch (deleteError) {
          console.error(
            "Errore durante l'eliminazione del referto temporaneo:",
            deleteError,
          );
        }
      }
      setIsExporting(false);
    }
  };

  const downloadSingleReport = async (reportId: string) => {
    if (!patient) {
      toast.error('Paziente non trovato');
      return;
    }

    try {
      setIsExporting(true);

      const result = await exportPDFMutation({
        reportIds: [reportId],
        patientId: patient.id,
        patient: {
          name: patient.user?.name || '',
          dateOfBirth: patient.medicalRecord?.birthDate
            ? typeof patient.medicalRecord.birthDate === 'string'
              ? patient.medicalRecord.birthDate
              : patient.medicalRecord.birthDate.toISOString().split('T')[0]
            : '',
          Gender: patient.medicalRecord?.gender || '',
          ID: patient.id,
        },
      });

      if (result.success && result.pdf) {
        const pdfBytes = new Uint8Array(result.pdf);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `referto_${patient.user?.name}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Referto scaricato con successo');
      } else {
        throw new Error('Errore nella generazione del PDF');
      }
    } catch (error) {
      console.error('Errore durante il download del referto:', error);
      toast.error('Errore durante il download del referto');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportReports,
    exportReportsAsCSV,
    previewFromBuilder,
    downloadSingleReport,
    isExporting,
  };
}
