'use client';

import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { useExport } from '@/features/questionnaires/context/export-context';
import type { available } from '@/features/questionnaires/settings';

import { AdministrationTableBody } from './table-body';
import { AdministrationTableHeader } from './table-header';
import { dateFilter } from './utils/filterFns';

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  compare?: boolean;
  questionnaire: (typeof available)[number];
}

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

export const AdministrationResultsTable = <TData, TValue>({
  columns,
  data,
  compare = false,
  questionnaire,
}: TableProps<TData, TValue>) => {
  const { userId } = useParams<{ userId: string }>();
  const { selectedIds, setIsAllSelected } = useExport();

  const goToCompare = `/pazienti/${userId}/assegnazioni/somministrazioni/risultati/${questionnaire}/compare`;
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>(
    Object.fromEntries(selectedIds.map((id) => [id, true])),
  );
  const { exportMode } = useExport();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);

  const getAdministrationIDs = (rowsSelected: Record<number, boolean>) => {
    return Object.keys(rowsSelected) as [string, string];
  };

  const table = useReactTable({
    filterFns: {
      fuzzy: dateFilter,
      state: dateFilter,
    },
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => (row as { id: string }).id,
    state: {
      rowSelection,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
  });

  const selectedNum = table.getSelectedRowModel().rows.length;

  const isAllSelected = table.getIsAllRowsSelected();
  const selectAll = table.getToggleAllRowsSelectedHandler();

  useEffect(() => {
    setIsAllSelected((prev) => {
      prev.set(questionnaire, {
        isAllSelected,
        selectAll,
      });
      return prev;
    });
  }, [isAllSelected, selectAll, questionnaire, setIsAllSelected]);

  return (
    <div className="grid grid-rows-[1fr_auto] justify-center pl-0 pr-8">
      <div className="flex flex-col justify-between overflow-hidden rounded-md bg-white">
        <Table className="w-full table-fixed">
          <AdministrationTableBody table={table} />
          <AdministrationTableHeader table={table} />
        </Table>
        {!exportMode && compare && (
          <div className="mt-4 flex items-center justify-end gap-4">
            <p className="text-sm text-gray-500">
              {selectedNum} somministrazioni selezionate
            </p>

            <Button
              asChild
              disabled={Object.keys(rowSelection).length !== 2}
              size="sm"
              className="text-sm"
            >
              <Link
                href={{
                  pathname: goToCompare,
                  query: {
                    comparison: getAdministrationIDs(rowSelection),
                  },
                }}
              >
                Confronta
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
