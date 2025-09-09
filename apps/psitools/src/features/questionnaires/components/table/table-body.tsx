import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { TableBody as TBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';

import { useColumns } from './columns';
import { getSize } from './utils/get-column-size';

interface TableBodyProps<TData> {
  table: Table<TData>;
}

export const AdministrationTableBody = <TData,>(
  props: TableBodyProps<TData>,
) => {
  const { table } = props;

  return (
    <TBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            className="border-none odd:bg-slate-50 even:bg-white"
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={cn(getSize(cell.column.columnDef.id), 'py-1 pl-0')}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={useColumns.length} className="h-24 text-center">
            Nessuna Somministrazione Effettuata
          </TableCell>
        </TableRow>
      )}
    </TBody>
  );
};
