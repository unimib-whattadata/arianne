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
            <p>Nessun invito </p>
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
            Nessuna paziente corrisponde ai filtri applicati.
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
          className="mb-2 rounded-md odd:bg-white even:bg-gray-50"
        >
          {row.getVisibleCells().map((cell, index) => (
            <TableCell
              key={cell.id}
              className={` ${getSize(cell.column.columnDef.id)} ${index === row.getVisibleCells().length - 1 ? 'text-right' : ''} `}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TBody>
  );
};
