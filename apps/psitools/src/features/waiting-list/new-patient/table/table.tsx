import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Table, TablePagination } from '@/components/ui/table';

import { TableBody } from './table-body';
import { TableHeader } from './table-header';
import { fuzzyFilter, stateFilter } from './utils/filterFns';

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    state: FilterFn<unknown>;
  }
}

export const NewPatientTable = <TData, TValue>({
  columns,
  data,
}: TableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    etichetta: false,
  });

  const table = useReactTable({
    filterFns: {
      fuzzy: fuzzyFilter,
      state: stateFilter,
    },
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="h-fit max-h-full overflow-auto rounded-sm">
        <Table className="w-full table-auto">
          <TableHeader table={table} />
          <TableBody
            table={table}
            rowProps={{
              className: '[&>*:last-child]:text-right',
            }}
          />
        </Table>
      </div>
      <TablePagination
        side="top"
        table={table}
        subject="pazienti"
        className="mt-auto pt-4"
        perPage={false}
        defaultPageSize={5}
      />
    </>
  );
};
