import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import {
  TableHead,
  TableHeader as THeader,
  TableRow,
} from '@/components/ui/table';

import { getSize } from './utils/get-column-size';

interface TableHeaderProps<TData> {
  table: Table<TData>;
}

export const TableHeader = <TData,>(props: TableHeaderProps<TData>) => {
  const { table } = props;

  return (
    <THeader className="sticky top-0 z-10 bg-white text-xs">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className={getSize(header.column.columnDef.id)}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </THeader>
  );
};
