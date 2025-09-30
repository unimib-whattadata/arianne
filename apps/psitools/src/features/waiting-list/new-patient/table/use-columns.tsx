import { useMemo } from 'react';
import type { Column, ColumnDef } from '@tanstack/react-table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreVertical,
  Send,
  Trash2,
} from 'lucide-react';
import { ListBadge } from '@/features/waiting-list/components/badge';
import type { BadgeState } from '@/features/waiting-list/components/badge';

interface Patient {
  name: string;
  email: string;
  date: string;
  status: BadgeState;
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
        accessorKey: 'status',
        header: ({ column }) => <SortHeader column={column} label="Stato" />,
        id: 'status',
        cell: ({ getValue }) => {
          const state = getValue() as BadgeState;
          return <ListBadge state={state} />;
        },
      },

      {
        id: 'link',
        accessorKey: 'link',
        header: '',
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <>
              {status === 'pending' && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="text-primary hover:text-primary/60 ml-4 inline h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto p-2" align="end">
                    <DropdownMenuItem>
                      <Send className="text-primary inline h-5 w-5" />
                      <p className="text-sm">Invia di nuovo </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="text-destructive inline h-5 w-5" />
                      <p className="text-sm">Cancella invito</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {status !== 'pending' && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="text-primary hover:text-primary/60 ml-4 inline h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto p-2" align="end">
                    <DropdownMenuItem>
                      <Trash2 className="text-destructive inline h-4 w-4" />
                      <p className="text-sm">Cancella invito</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          );

          return null;
        },
      },
    ],
    [],
  );
};
