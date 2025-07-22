'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export function useExportTemplates() {
  const [isExporting, setIsExporting] = useState(false);
  const { patient } = usePatient();
  const api = useTRPC();

  const { mutateAsync: exportPDFMutation } = useMutation(
    api.templates.exportPDF.mutationOptions({
      onError: (error) => {
        console.error('Errore durante la generazione del PDF:', error);
        toast.error('Errore durante la generazione del PDF');
        setIsExporting(false);
      },
    }),
  );

  const exportTemplates = async ({
    templateIds,
    mode = 'export',
  }: {
    templateIds: string[];
    mode?: 'export' | 'print';
  }) => {
    if (!patient) {
      toast.error('Paziente non trovato');
      return;
    }

    if (templateIds.length === 0) {
      toast.error(
        `Seleziona almeno un template da ${mode === 'print' ? 'stampare' : 'esportare'}`,
      );
      return;
    }

    try {
      setIsExporting(true);

      const result = await exportPDFMutation({
        templateIds,
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
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('PDF aperto con successo');
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

  return { exportTemplates, isExporting };
}
