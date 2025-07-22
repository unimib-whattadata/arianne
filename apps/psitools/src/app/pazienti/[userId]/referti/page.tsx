'use client';

import { useQuery } from '@tanstack/react-query';
import { FileUp, Plus, Printer } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { RefertiTable } from '@/features/referti/components/referti-table';
import { SearchBar } from '@/features/referti/components/search-bar';
import { useExportReports } from '@/features/referti/hook/use-report-export';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export default function RefertiPage() {
  interface Report {
    id: string;
    titolo: string;
    dataCreazione: Date;
    ultimaModifica: Date;
    dimensione: string;
    autore: string;
    iniziali: string;
  }

  const [filteredReferti, setFilteredReferti] = useState<Report[]>([]);
  const [isExportMode, setIsExportMode] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [selectedReferti, setSelectedReferti] = useState<string[]>([]);
  const pathname = usePathname();
  const { patient } = usePatient();
  const api = useTRPC();
  const { exportReports, isExporting } = useExportReports();

  const { data: reports, isLoading } = useQuery(
    api.reports.findMany.queryOptions(
      { patientId: patient?.id || '' },
      { enabled: !!patient?.id },
    ),
  );

  useEffect(() => {
    if (reports) {
      setFilteredReferti(
        reports.map((report) => ({ ...report, autore: report.autore ?? '' })),
      );
    }
  }, [reports]);

  const handleSearch = (query: string) => {
    if (!query.trim() || !reports) {
      setFilteredReferti(
        (reports || []).map((report) => ({
          ...report,
          autore: report.autore ?? '',
        })),
      );
      return;
    }

    const filtered = reports
      .filter((report) =>
        report.titolo.toLowerCase().includes(query.toLowerCase()),
      )
      .map((report) => ({ ...report, autore: report.autore ?? '' }));
    setFilteredReferti(filtered);
  };

  const handleExportModeToggle = () => {
    setIsExportMode(!isExportMode);
    setIsPrintMode(false);
    setSelectedReferti([]);
  };

  const handlePrintModeToggle = () => {
    setIsPrintMode(!isPrintMode);
    setIsExportMode(false);
    setSelectedReferti([]);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedReferti(selectedIds);
  };

  const handleDownloadSelected = async () => {
    if (selectedReferti.length === 0) {
      toast.error('Seleziona almeno un referto da esportare');
      return;
    }

    try {
      await exportReports({ reportIds: selectedReferti, mode: 'export' });
    } catch (error) {
      console.error("Errore durante l'export:", error);
    }
  };

  const handlePrintSelected = async () => {
    if (selectedReferti.length === 0) {
      toast.error('Seleziona almeno un referto da stampare');
      return;
    }

    try {
      await exportReports({ reportIds: selectedReferti, mode: 'print' });
    } catch (error) {
      console.error('Errore durante la stampa:', error);
    }
  };

  const isSelectionMode = isExportMode || isPrintMode;

  if (isLoading) {
    return <div className="p-4 pt-0">Caricamento in corso...</div>;
  }

  return (
    <div className="p-4 pt-0">
      <h1 className="mb-4 text-2xl font-bold">Referti</h1>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="icon">
            <Share />
          </Button> */}
          <Button
            variant={isPrintMode ? 'default' : 'outline'}
            size="icon"
            onClick={handlePrintModeToggle}
            disabled={isExporting}
          >
            <Printer />
          </Button>
          <Button
            variant={isExportMode ? 'default' : 'outline'}
            size="icon"
            onClick={handleExportModeToggle}
            disabled={isExporting}
          >
            <FileUp />
          </Button>
          <Button asChild className="bg-primary">
            <Link href={`${pathname}/builder/nuovo`}>
              <Plus />
              Nuovo
            </Link>
          </Button>
        </div>
      </div>

      {isExportMode && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-primary">
            Hai selezionato:{' '}
            <span className="text-sm text-gray-500">
              {' '}
              {selectedReferti.length} referti{' '}
            </span>
          </div>
          <Button
            onClick={handleDownloadSelected}
            disabled={selectedReferti.length === 0 || isExporting}
          >
            {isExporting ? 'Generazione in corso...' : 'Scarica'}
          </Button>
        </div>
      )}

      {isPrintMode && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-primary">
            Hai selezionato:{' '}
            <span className="text-sm text-gray-500">
              {' '}
              {selectedReferti.length} referti per la stampa{' '}
            </span>
          </div>
          <Button
            onClick={handlePrintSelected}
            disabled={selectedReferti.length === 0 || isExporting}
          >
            {isExporting ? 'Preparazione stampa...' : 'Stampa'}
          </Button>
        </div>
      )}

      <RefertiTable
        referti={filteredReferti}
        isExportMode={isSelectionMode}
        selectedReferti={selectedReferti}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
