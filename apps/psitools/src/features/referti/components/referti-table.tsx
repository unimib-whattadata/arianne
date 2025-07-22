'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  Copy,
  Download,
  ExternalLink,
  MoreVertical,
  Save,
  // Share,
  Trash2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExportReports } from '@/features/referti/hook/use-report-export';
import { useTRPC } from '@/trpc/react';

interface ReportContent {
  date?: Date;
  time?: string;
  sections?: { title?: string; description?: string }[];
  titles?: { content?: string }[];
  paragraphs?: { content?: string }[];
  attachments?: { id?: string; name?: string; date?: string; type?: string }[];
  theme?: {
    font: string;
    titleSize: string;
    paragraphSize: string;
    primaryColor: string;
  };
}

export interface Referto {
  id: string;
  titolo: string;
  dataCreazione: Date;
  ultimaModifica: Date;
  dimensione: string;
  autore: string;
  iniziali: string;
  content?: unknown;
}

type SortField = 'titolo' | 'dataCreazione' | 'ultimaModifica';
type SortDirection = 'asc' | 'desc';

interface RefertiTableProps {
  referti: Referto[];
  isExportMode: boolean;
  selectedReferti: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function RefertiTable({
  referti,
  isExportMode,
  selectedReferti,
  onSelectionChange,
}: RefertiTableProps) {
  const [sortField, setSortField] = useState<SortField>('titolo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const pathname = usePathname();
  const router = useRouter();

  const api = useTRPC();
  const queryClient = useQueryClient();

  const { downloadSingleReport, isExporting } = useExportReports();

  const duplicateReportMutation = useMutation(
    api.reports.duplicate.mutationOptions({
      onSuccess: async () => {
        toast.success('Referto duplicato con successo');
        await queryClient.invalidateQueries(api.reports.findMany.queryFilter());
      },
      onError: (error) => {
        console.error('Errore durante la duplicazione:', error);
        toast.error('Si è verificato un errore durante la duplicazione');
      },
    }),
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleOpenReferto = (id: string) => {
    if (!isExportMode) {
      router.push(`${pathname}/builder/${id}`);
    }
  };

  const handleCheckboxChange = (refertoId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedReferti, refertoId]);
    } else {
      onSelectionChange(selectedReferti.filter((id) => id !== refertoId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(referti.map((referto) => referto.id));
    } else {
      onSelectionChange([]);
    }
  };

  const deleteReportMutation = useMutation(
    api.reports.delete.mutationOptions({
      onSuccess: async () => {
        toast.success('Referto eliminato con successo');
        router.refresh();
        await queryClient.invalidateQueries(api.reports.findMany.queryFilter());
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
        toast.success('Modello creato con successo');
        await queryClient.invalidateQueries(
          api.templates.findAll.queryFilter(),
        );
      },
      onError: (error) => {
        console.error('Errore durante la creazione del modello:', error);
        toast.error(
          'Si è verificato un errore durante la creazione del modello',
        );
      },
    }),
  );

  const handleDeleteReferto = async (id: string) => {
    try {
      await deleteReportMutation.mutateAsync({ id });
    } catch {
      console.error("Errore durante l'eliminazione del referto");
    }
  };

  const handleSaveAsTemplate = async (referto: Referto) => {
    try {
      const templateTitle = `${referto.titolo} `;

      let templateContent: ReportContent = {};

      if (referto.content && typeof referto.content === 'object') {
        const content = referto.content as ReportContent;

        let dateValue: Date;
        if (content.date) {
          if (typeof content.date === 'string') {
            dateValue = new Date(content.date);
          } else {
            dateValue = content.date;
          }
          if (isNaN(dateValue.getTime())) {
            dateValue = new Date();
          }
        } else {
          dateValue = new Date();
        }

        templateContent = {
          date: dateValue,
          time: content.time || new Date().toTimeString().slice(0, 5),
          sections: content.sections || [],
          titles: content.titles || [],
          paragraphs: content.paragraphs || [],
          attachments: content.attachments || [],
          theme: (() => {
            if (
              content.theme &&
              typeof content.theme === 'object' &&
              'font' in content.theme &&
              'titleSize' in content.theme &&
              'paragraphSize' in content.theme &&
              'primaryColor' in content.theme &&
              typeof content.theme.font === 'string' &&
              typeof content.theme.titleSize === 'string' &&
              typeof content.theme.paragraphSize === 'string' &&
              typeof content.theme.primaryColor === 'string'
            ) {
              return {
                font: content.theme.font,
                titleSize: content.theme.titleSize,
                paragraphSize: content.theme.paragraphSize,
                primaryColor: content.theme.primaryColor,
              };
            }
            return undefined;
          })(),
        };
      } else {
        templateContent = {
          date: new Date(),
          time: new Date().toTimeString().slice(0, 5),
          sections: [],
          titles: [],
          paragraphs: [],
          attachments: [],
          theme: undefined,
        };
      }

      console.log('Creando template con contenuto:', templateContent);

      await createTemplateMutation.mutateAsync({
        title: templateTitle,
        content: templateContent,
      });
    } catch (error) {
      console.error('Errore durante la creazione del template:', error);
      toast.error('Errore durante la creazione del template');
    }
  };

  const handleDownloadReferto = async (id: string) => {
    try {
      await downloadSingleReport(id);
    } catch (error) {
      console.error('Errore durante il download del referto:', error);
    }
  };

  const handleDuplicateReferto = async (id: string) => {
    try {
      await duplicateReportMutation.mutateAsync({ id });
    } catch (error) {
      console.error('Errore durante la duplicazione del referto:', error);
    }
  };

  const sortedReferti = [...referti].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'titolo':
        comparison = a.titolo.localeCompare(b.titolo);
        break;
      case 'dataCreazione':
        comparison =
          new Date(a.dataCreazione).getTime() -
          new Date(b.dataCreazione).getTime();
        break;
      case 'ultimaModifica':
        comparison =
          new Date(a.ultimaModifica).getTime() -
          new Date(b.ultimaModifica).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowDownNarrowWide className="ml-1 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowDownNarrowWide className="ml-1 h-4 w-4" />
    ) : (
      <ArrowUpWideNarrow className="ml-1 h-4 w-4" />
    );
  };

  const isAllSelected =
    referti.length > 0 && selectedReferti.length === referti.length;
  const isIndeterminate =
    selectedReferti.length > 0 && selectedReferti.length < referti.length;

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {isExportMode && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected || isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  className={
                    isIndeterminate && !isAllSelected ? 'opacity-50' : ''
                  }
                />
              </TableHead>
            )}
            <TableHead className="font-medium">
              <Button
                variant="ghost"
                size="sm"
                className="flex h-8 items-center px-2 py-0 font-medium"
                onClick={() => toggleSort('titolo')}
              >
                Nome del file
                {renderSortIcon('titolo')}
              </Button>
            </TableHead>
            <TableHead className="font-medium">
              <Button
                variant="ghost"
                size="sm"
                className="flex h-8 items-center px-2 py-0 font-medium"
                onClick={() => toggleSort('dataCreazione')}
              >
                Data di creazione
                {renderSortIcon('dataCreazione')}
              </Button>
            </TableHead>
            <TableHead className="font-medium">
              <Button
                variant="ghost"
                size="sm"
                className="flex h-8 items-center px-2 py-0 font-medium"
                onClick={() => toggleSort('ultimaModifica')}
              >
                Ultima modifica
                {renderSortIcon('ultimaModifica')}
              </Button>
            </TableHead>

            <TableHead className="font-medium">Autore</TableHead>
            {!isExportMode && <TableHead className="w-[40px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReferti.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isExportMode ? 6 : 7}
                className="py-8 text-center"
              >
                Nessun referto trovato
              </TableCell>
            </TableRow>
          ) : (
            sortedReferti.map((referto) => (
              <TableRow
                key={referto.id}
                className={`border-none odd:bg-slate-50 even:bg-white ${
                  !isExportMode ? 'cursor-pointer hover:bg-slate-100' : ''
                }`}
                onClick={() => handleOpenReferto(referto.id)}
              >
                {isExportMode && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedReferti.includes(referto.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(referto.id, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">{referto.titolo}</TableCell>
                <TableCell className="text-center">
                  {format(new Date(referto.dataCreazione), 'dd/MM/yyyy', {
                    locale: it,
                  })}
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(referto.ultimaModifica), 'dd/MM/yyyy', {
                    locale: it,
                  })}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-slate-200">
                      <AvatarFallback className="text-sm">
                        {referto.iniziali}
                      </AvatarFallback>
                    </Avatar>
                    <span>{referto.autore}</span>
                  </div>
                </TableCell>
                {!isExportMode && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Apri menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-between text-primary"
                          onClick={() => handleOpenReferto(referto.id)}
                        >
                          <span>Apri</span>
                          <ExternalLink />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-between text-primary"
                          onClick={() => handleDuplicateReferto(referto.id)}
                          disabled={
                            duplicateReportMutation.isPending || isExporting
                          }
                        >
                          <span>Duplica</span>
                          <Copy />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-between text-primary"
                          onClick={() => handleDownloadReferto(referto.id)}
                          disabled={isExporting}
                        >
                          <span>Scarica</span>
                          <Download />
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="flex cursor-pointer items-center justify-between text-primary">
                          <span>Condividi</span>
                          <Share />
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-between text-primary"
                          onClick={() => handleSaveAsTemplate(referto)}
                        >
                          <span>Salva come modello</span>
                          <Save />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-between text-red-500"
                          onClick={() => {
                            toast(
                              'Sei sicuro di voler eliminare questo referto?',
                              {
                                action: {
                                  label: 'Conferma',
                                  onClick: () => {
                                    void handleDeleteReferto(referto.id);
                                  },
                                },
                                cancel: {
                                  label: 'Annulla',
                                  onClick: () => {
                                    console.log('Azione annullata');
                                  },
                                },
                              },
                            );
                          }}
                        >
                          <span>Elimina</span>
                          <Trash2 />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
