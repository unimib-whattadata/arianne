import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TableBody as TBody, TableCell, TableRow } from '@/components/ui/table';

import { getSize } from './utils/get-column-size';

interface TableBodyProps<TData> {
  table: Table<TData>;
  rowProps?: React.HTMLAttributes<HTMLTableRowElement>;
}

export const TableBody = <TData,>(props: TableBodyProps<TData>) => {
  const { table, rowProps } = props;
  const numVisibleColumns = table.getVisibleFlatColumns().length;

  if (table.getPreFilteredRowModel().rows.length === 0) {
    return (
      <TBody className="bg-white">
        <TableRow>
          <TableCell colSpan={numVisibleColumns} className="h-24">
            <p>
              Non hai ancora registrato nessun paziente. <br />
              Inizia aggiungendo il tuo primo paziente
            </p>
            <br />
            <Button variant="outline" asChild>
              <Link href="/pazienti/nuovo-paziente">
                <Plus className="h-4 w-4" />
                Aggiungi paziente
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      </TBody>
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <TBody className="bg-white">
        <TableRow>
          <TableCell colSpan={numVisibleColumns} className="h-24">
            Nessun paziente trovato.
          </TableCell>
        </TableRow>
      </TBody>
    );
  }

  return (
    <TBody className="bg-white">
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          {...rowProps}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={getSize(cell.column.columnDef.id)}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TBody>
  );
};
