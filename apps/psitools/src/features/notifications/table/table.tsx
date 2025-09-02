'use client';
import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';

import { Table, TablePagination } from '@/components/ui/table';

import { TableBody } from './table-body';
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

export const NotificationsTable = <TData, TValue>({
  columns,
  data,
}: TableProps<TData, TValue>) => {
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
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="h-fit max-h-full overflow-auto rounded-sm">
        <Table className="mb-4 w-full table-auto">
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
        subject="notifiche"
        className="mt-auto"
      />
    </>
  );
};
