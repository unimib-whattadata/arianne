import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateBadge } from '@/features/patient/components/state-badge';
import { useTRPC } from '@/trpc/react';
import type { RouterOutputs } from '@arianne/api';
import type { medicalRecordStateEnum, Tag } from '@arianne/db/schema';

type Patient = RouterOutputs['patients']['findUnique'];
type Profile = RouterOutputs['profiles']['get'];

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
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    api.therapists.updateRecentPatients.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.therapists.findUnique.queryFilter(),
        );
      },
    }),
  );
  return useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        header: ({ column }) => (
          <SortHeader column={column} label="Nome completo" />
        ),
        id: 'name',
        accessorKey: 'user',
        accessorFn: (patient) => patient?.profile,
        filterFn: 'fuzzy',
        cell(props) {
          const { getValue } = props;
          const profile = getValue() as Profile;
          if (!profile) return null;
          return <p>{profile.name}</p>;
        },
      },
      {
        id: 'cod',
        header: ({ column }) => (
          <SortHeader column={column} label="Codice ID" />
        ),
        accessorKey: 'user',
        accessorFn: (patient) => patient?.profile,
        filterFn: 'fuzzy',
        cell(props) {
          const { getValue } = props;
          const profile = getValue() as Profile;
          if (!profile) return null;
          return <p>{profile.id}</p>;
        },
      },
      {
        id: 'tag',
        header: 'Tag',
        accessorKey: 'medicalRecords.tags',
        cell(props) {
          const { getValue } = props;
          const tags = getValue() as Tag[];
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
          const state =
            getValue() as (typeof medicalRecordStateEnum.enumValues)[number];

          return <StateBadge state={state} />;
        },
        accessorKey: 'medicalRecords.state',
      },
      {
        id: 'actions',
        enableResizing: true,
        cell(props) {
          const { row } = props;
          const { profileId } = row.original!;
          if (!profileId) return null;

          const updateRecentPatients = () => {
            mutate({
              patientId: profileId,
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
              <Link href={`/pazienti/${profileId}/cartella-clinica`}>
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
