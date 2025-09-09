'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ArrowDown01, ArrowDown10, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useExport } from '@/features/questionnaires/context/export-context';
import type { RouterOutputs } from '@arianne/api';

type Administration =
  RouterOutputs['administrations']['findUnique']['administration'];

export const useColumns = (currentPath: string, exportMode: boolean) => {
  const { setSelectedIds } = useExport();

  return useMemo<ColumnDef<Administration>[]>(
    () => [
      {
        id: 'checked',
        header: (props) => {
          const { table } = props;
          const allRowsSelected = table.getIsAllRowsSelected();
          const isIndeterminate = table.getIsSomeRowsSelected();

          return (
            <div className="flex items-center">
              {!exportMode && (
                <Checkbox
                  checked={allRowsSelected}
                  onCheckedChange={(value) => {
                    table.toggleAllRowsSelected(!!value);
                  }}
                  aria-checked={isIndeterminate ? 'mixed' : allRowsSelected}
                  aria-label="Seleziona tutte le righe"
                  className="peer border-primary-300 border"
                />
              )}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;

          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const id = row.original.id;
            if (row.getIsSelected()) {
              setSelectedIds((prev) => [...new Set([...prev, id])]);
            } else {
              setSelectedIds((prev) =>
                prev.filter((selectedId) => selectedId !== id),
              );
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [row.getIsSelected(), row.original.id, setSelectedIds]);

          return (
            <div className="flex items-center">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                className="border-primary-300 border"
              />
            </div>
          );
        },
      },

      {
        id: 'name',
        accessorKey: 'T',
        cell: (props) => {
          const { cell } = props;
          const T = cell.getValue() as number;
          return <p className="text-sm">{`T${T}`}</p>;
        },
        header: () => {
          return <p className="text-sm font-semibold">#</p>;
        },
      },
      {
        id: 'date',
        accessorKey: 'date',
        sortingFn: 'datetime',
        cell: (props) => {
          const { getValue } = props;
          const dateString = format(getValue() as Date, 'dd/MM/yyyy', {
            locale: it,
          });
          return <p className="text-sm">{dateString}</p>;
        },
        header: (props) => {
          const { column } = props;
          const _isSorted = column.getIsSorted(); // 'asc' | 'desc' | false

          return (
            <Button
              onClick={column.getToggleSortingHandler()}
              variant="ghost"
              className="flex flex-row gap-2 px-0 hover:bg-transparent"
            >
              <p className="text-sm font-semibold">Data</p>
              <div className="flex flex-col justify-center">
                {_isSorted === 'asc' ? (
                  <ArrowDown01 size={16} />
                ) : (
                  <ArrowDown10 size={16} />
                )}
              </div>
            </Button>
          );
        },
      },

      {
        id: 'method',
        cell: () => {
          return <p className="text-sm">Prova</p>;
        },

        header: () => {
          return <p className="text-sm font-semibold">Modalità </p>;
        },
      },
      {
        id: 'open',
        accessorKey: 'id',
        header: () => <></>,
        cell: (props) => {
          const { getValue } = props;
          const administrationId = getValue() as string;

          return (
            <div className="flex w-full items-center justify-end gap-2">
              {!exportMode && (
                <>
                  <Link
                    href={`${currentPath}/${administrationId}`}
                    className="text-primary ml-auto px-0 text-sm"
                  >
                    Apri
                  </Link>
                  <SquareArrowOutUpRight size={16} className="text-primary" />
                </>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exportMode, currentPath],
  );
};

export const useColumnsCompare = () => {
  return useMemo<ColumnDef<Administration>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'T',
        cell: (props) => {
          const { cell } = props;
          const T = cell.getValue() as number;
          return <p className="pl-4 text-sm">{`T${T}`}</p>;
        },
        header: () => {
          return <p className="pl-4 text-sm font-semibold">#</p>;
        },
      },
      {
        id: 'date',
        accessorKey: 'date',
        sortingFn: 'datetime',
        cell: (props) => {
          const { getValue } = props;
          const dateString = format(getValue() as Date, 'dd/MM/yyyy', {
            locale: it,
          });
          return <p className="text-sm">{dateString}</p>;
        },
        header: (props) => {
          const { column } = props;
          const _isSorted = column.getIsSorted(); // 'asc' | 'desc' | false

          return (
            <Button
              onClick={column.getToggleSortingHandler()}
              variant="ghost"
              className="flex flex-row gap-2 px-0 hover:bg-transparent"
            >
              <p className="text-sm font-semibold">Data</p>
              <div className="flex flex-col justify-center">
                {_isSorted === 'asc' ? (
                  <ArrowDown01 size={16} />
                ) : (
                  <ArrowDown10 size={16} />
                )}
              </div>
            </Button>
          );
        },
      },
      {
        id: 'method',
        cell: () => {
          return <p className="text-sm">Prova</p>;
        },

        header: () => {
          return <p className="text-sm font-semibold">Modalità </p>;
        },
      },
      {
        id: 'open',
        accessorKey: 'id',
        header: () => <></>,
        cell: (props) => {
          const { getValue } = props;
          const id = getValue() as string;

          return (
            <div className="flex w-full items-center justify-end gap-2">
              <Link
                href={`administration/${id}`}
                target="_blank"
                className="text-primary ml-auto px-0 text-sm"
              >
                Apri
              </Link>
              <SquareArrowOutUpRight size={16} className="text-primary" />
            </div>
          );
        },
      },
    ],
    [],
  );
};
