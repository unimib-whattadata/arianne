import { useMutation } from '@tanstack/react-query';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useExport } from '@/features/questionnaires/context/export-context';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

interface ExportSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
];

const includeOptions = [
  { label: 'Risultati', key: 'results' },
  { label: 'Risposte', key: 'responses' },
  { label: 'Note', key: 'notes' },
];

const ExportSheet: React.FC<ExportSheetProps> = ({ isOpen, onClose }) => {
  const [formatOption, setFormatOption] = useState<string>('pdf');
  const [includeAll, setIncludeAll] = useState(true);
  const [includeValues, setIncludeValues] = useState<Record<string, boolean>>(
    {},
  );
  const { selectedIds } = useExport();
  const numberOfSelectedIds = selectedIds.length;
  const { patient } = usePatient();
  const api = useTRPC();

  const { mutateAsync: mutatePDF } = useMutation(
    api.export.exportPDF.mutationOptions(),
  );

  const { mutateAsync: mutateCSV } = useMutation(
    api.export.exportCSV.mutationOptions(),
  );

  useEffect(() => {
    const initialValues = Object.fromEntries(
      includeOptions.map(({ key }) => [key, true]),
    );
    setIncludeValues(initialValues);
    setIncludeAll(true);
    setFormatOption('pdf');
  }, [isOpen]);

  useEffect(() => {
    if (numberOfSelectedIds === 0) {
      onClose();
    }
  }, [selectedIds, onClose, numberOfSelectedIds]);

  const toggleAll = (checked: boolean) => {
    const updated = Object.fromEntries(
      includeOptions.map(({ key }) => [key, checked]),
    );

    setIncludeValues(updated);
    setIncludeAll(checked);
  };

  const toggleSingle = (key: string) => {
    const updated = {
      ...includeValues,
      [key]: !includeValues[key],
    };

    const allSelected = Object.values(updated).every(Boolean);
    setIncludeAll(allSelected);
    setIncludeValues(updated);
  };
  const hasAtLeastOneChecked = Object.values(includeValues).some(Boolean);

  const onClickExport = async () => {
    if (!patient?.id) return null;

    if (formatOption === 'pdf') {
      const response = await mutatePDF({
        patientId: patient?.id,

        options: {
          notes: includeValues.notes,
          scores: includeValues.results,
          responses: includeValues.responses,
        },

        questionnaires: selectedIds,
      });

      // ricezione e download del file PDF
      const pdf = Uint8Array.from(response.pdf as Iterable<number>);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Export questionari ' + patient?.user?.name; // nome file
      link.click();
    } else {
      const zip = new JSZip();
      const administrations = await mutateCSV({ questionnaires: selectedIds });

      if (administrations.length === 1) {
        const blob = new Blob([administrations[0].csv], {
          type: 'text/csv;charset=utf-8',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download =
          administrations[0].type.toUpperCase() +
          ' (T' +
          administrations[0].T +
          ') ' +
          patient?.user?.name;
        link.click();
      } else {
        for (const administration of administrations) {
          zip.file(
            administration.type.toUpperCase() +
              ' (T' +
              administration.T +
              ') ' +
              patient?.user?.name +
              '.csv',
            administration.csv,
          );
        }

        await zip.generateAsync({ type: 'blob' }).then(function (content) {
          FileSaver.saveAs(
            content,
            'Export questionari ' + patient?.user?.name + '.zip',
          );
        });
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetTitle className="text-md font-semibold">Esporta</SheetTitle>

        <p className="pb-4 pt-5 text-base">
          Hai selezionato:{' '}
          <span className="font-semibold text-primary">
            {numberOfSelectedIds}{' '}
            {numberOfSelectedIds === 1
              ? 'somministrazione'
              : 'somministrazioni'}
          </span>
        </p>

        <div className="grid grid-cols-2 gap-2 pb-5">
          <p className="col-span-1 text-base">Includi:</p>
          <div className="col-span-1 flex items-center gap-2">
            <Checkbox
              checked={includeAll}
              onCheckedChange={(val) => toggleAll(Boolean(val))}
              className="border border border-primary-300"
            />
            <p className="text-base">Tutto</p>
          </div>

          {includeOptions.map(({ label, key }) => (
            <div
              key={key}
              className="col-span-1 col-start-2 flex items-center gap-2 pl-5"
            >
              <Checkbox
                checked={includeValues[key]}
                onCheckedChange={() => toggleSingle(key)}
                className="border border border-primary-300"
              />
              <p className="text-base">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-2 pb-5">
          <p className="col-span-1 text-base">Seleziona il formato:</p>
          {formatOptions.map((option) => (
            <label
              key={option.value}
              className="col-span-1 col-start-2 flex cursor-pointer items-center gap-2 text-base"
            >
              <Input
                type="radio"
                name="sortOption"
                value={option.value}
                checked={formatOption === option.value}
                onChange={() => setFormatOption(option.value)}
                className="h-4 w-4 text-primary accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
        <Button
          variant="default"
          className="w-full text-base"
          disabled={!hasAtLeastOneChecked}
          onClick={() => onClickExport()}
        >
          Esporta
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default ExportSheet;
