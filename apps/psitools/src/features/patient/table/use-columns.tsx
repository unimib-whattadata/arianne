import type { $Enums, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateBadge } from '@/features/patient/components/state-badge';
import { useTRPC } from '@/trpc/react';
import type { PatientWithRelations } from '@/types/patient-with-relations';

const SortHeader = ({
  column,
  label,
}: {
  column: Column<PatientWithRelations, unknown>;
  label: string;
}) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="link"
      size="sm"
      className="px-0 font-semibold text-foreground [&:has([role=checkbox])]:pr-0"
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
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    api.therapist.updateRecentPatients.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.therapist.findUnique.queryFilter(),
        );
      },
    }),
  );
  return useMemo<ColumnDef<PatientWithRelations>[]>(
    () => [
      {
        header: ({ column }) => (
          <SortHeader column={column} label="Nome completo" />
        ),
        id: 'name',
        accessorKey: 'user',
        accessorFn: (patient) => patient.user,
        filterFn: 'fuzzy',
        cell(props) {
          const { getValue } = props;
          const user = getValue() as User;
          if (!user) return null;
          return <p>{user.name}</p>;
        },
      },
      {
        id: 'cod',
        header: ({ column }) => (
          <SortHeader column={column} label="Codice ID" />
        ),
        accessorKey: 'user',
        accessorFn: (patient) => patient.user,
        filterFn: 'fuzzy',
        cell(props) {
          const { getValue } = props;
          const user = getValue() as User;
          if (!user) return null;
          return <p>{user.id}</p>;
        },
      },
      {
        id: 'tag',
        header: 'Tag',
        accessorKey: 'medicalRecord.tags',
        cell(props) {
          const { getValue } = props;
          const tags = getValue() as PrismaJson.TagType[];
          if (!tags) return null;
          return tags.map((tag) => (
            <Badge key={tag.text} className="mr-1">
              {tag.text}
            </Badge>
          ));
        },
      },
      {
        id: 'state',
        header: 'Stato',
        filterFn: 'state',
        cell: (props) => {
          const { getValue } = props;
          const state = getValue() as $Enums.StateType;

          return <StateBadge state={state} />;
        },
        accessorKey: 'medicalRecord.state',
      },
      {
        id: 'actions',
        enableResizing: true,
        cell(props) {
          const { row } = props;
          const { user } = row.original;
          if (!user?.id) return null;

          const updateRecentPatients = () => {
            mutate({
              patientId: user?.id,
            });
          };

          return (
            <Button
              asChild
              variant="link"
              size="sm"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              onClick={updateRecentPatients}
            >
              <Link href={`/pazienti/${user.id}/cartella-clinica`}>
                Vai al paziente
              </Link>
            </Button>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
