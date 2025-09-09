import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

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
            <p>Non hai ancora nessuna notifica</p>
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
            Nessuna notifica corrisponde ai filtri applicati.
          </TableCell>
        </TableRow>
      </TBody>
    );
  }

  return (
    <TBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          {...rowProps}
          className="mb-2 block rounded-md bg-white"
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
