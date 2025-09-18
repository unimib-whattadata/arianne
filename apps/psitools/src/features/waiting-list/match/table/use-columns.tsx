import { useMemo } from 'react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

interface Patient {
  name: string;
  email: string;
  date: string;
}
const SortHeader = ({
  column,
  label,
}: {
  column: Column<Patient, unknown>;
  label: string;
}) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="link"
      size="sm"
      className="text-foreground px-0 font-semibold [&:has([role=checkbox])]:pr-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      {isSorted === 'desc' && <ChevronDown className="h-4 w-4" />}
      {isSorted === 'asc' && <ChevronUp className="h-4 w-4" />}
      {!isSorted && <ChevronsUpDown className="h-4 w-4" />}
    </Button>
  );
};

export const useColumns = () => {
  return useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        header: ({ column }) => <SortHeader column={column} label="Paziente" />,
        accessorKey: 'name',
        cell: (info) => info.getValue(),
        id: 'name',
      },
      {
        accessorKey: 'email',
        header: ({ column }) => <SortHeader column={column} label="Email" />,
        cell: (info) => info.getValue(),
        id: 'email',
      },
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <SortHeader column={column} label="Data d'invio" />
        ),
        cell: (info) => info.getValue(),
        id: 'date',
      },
      {
        id: 'link',
        accessorKey: 'link',
        header: '',
        cell: () => (
          <Link href={`#`} className="text-primary hover:underline">
            Visualizza profilo
          </Link>
        ),
      },
    ],
    [],
  );
};
