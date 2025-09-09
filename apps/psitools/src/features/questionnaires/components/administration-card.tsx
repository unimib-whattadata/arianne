'use client';

import type { Administration } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Info, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AssignmentSheet } from '@/features/assignments/components/assignment-sheet';
import { useColumns } from '@/features/questionnaires/components/table/columns';
import { useExport } from '@/features/questionnaires/context/export-context';
import { useFavoritesAdministrations } from '@/features/questionnaires/hooks/use-favorites-administrations';
import type { available } from '@/features/questionnaires/settings';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

import { AdministrationResultsTable } from './table/table';

export interface Props {
  administrationType: string;
  numOfAdministrations: number;
  lastAdministration: string;
  administrationId: (typeof available)[number];
  administrations: Administration[];
  disorder: string;
  informations: string;
}

export const AdministrationCard = (props: Props) => {
  const {
    administrationType,
    numOfAdministrations,
    lastAdministration,
    administrationId,
    administrations,
    informations,
  } = props;
  const { exportMode, isAllSelected } = useExport();
  const pathname = usePathname();
  const { patient } = usePatient();
  const columns = useColumns(
    `${pathname}/risultati/${administrationId}/administration`,
    exportMode,
  );

  const { isAllSelected: isThisAllSelected, selectAll } = isAllSelected.get(
    administrationId,
  ) ?? {
    isAllSelected: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    selectAll: () => {},
  };

  useEffect(() => {
    if (numOfAdministrations === 0) return;
    if (exportMode) {
      setOpen([administrationType]);
      return;
    }

    setOpen([]);
  }, [administrationType, numOfAdministrations, exportMode]);

  const [open, setOpen] = useState<string[]>();

  const api = useTRPC();
  const queryClient = useQueryClient();

  const [openSheet, setOpenSheet] = useState(false);

  const { favorites, setFavorites } = useFavoritesAdministrations();
  const isFavorite = favorites?.includes(administrationId) ?? false;
  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites!.filter((fav) => fav !== administrationId));
    } else {
      setFavorites([...(favorites ?? []), administrationId]);
    }
  };

  const { data: assignments } = useQuery(
    api.assignments.get.queryOptions(patient?.id, {
      enabled: !!patient,
      select: (data) =>
        data
          .filter((assignments) => assignments.type === 'administration')
          .map((assignment) => {
            return { id: assignment.id, name: assignment.name };
          }),
    }),
  );

  const { mutate: unassign } = useMutation(
    api.assignments.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.assignments.get.queryFilter());
        toast.success('Assegnazione rimossa con successo');
      },
    }),
  );

  const assignment = assignments?.filter((assignment) => {
    return assignment?.name === administrationId;
  })[0];

  const isAssigned = assignments?.some(
    (assignment) => assignment.name === administrationId,
  );

  const updateAssignedQuestionnaire = () => {
    if (!patient) return;

    if (isAssigned && assignment) {
      toast(`Rimuovere l'assegnazione di ${assignment.name}?`, {
        action: {
          label: 'Conferma',
          onClick: () => {
            unassign(assignment.id);
          },
        },
        cancel: {
          label: 'Annulla',
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      return;
    }

    setOpenSheet(true);
  };

  return (
    <>
      <Accordion
        type="multiple"
        className={`rounded-md bg-white p-4`}
        value={open}
        onValueChange={(value) => {
          setOpen(value);
        }}
      >
        <AccordionItem
          value={administrationType}
          key={administrationType}
          className="border-none"
        >
          <AccordionTrigger className="flex w-full justify-between p-0 hover:no-underline">
            <div className="flex w-full flex-row items-center space-y-0">
              {exportMode && (
                <Checkbox
                  id={administrationId}
                  checked={isThisAllSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAll(e);
                  }}
                  className="mr-4"
                  disabled={numOfAdministrations === 0}
                  asChild
                />
              )}

              <Badge
                className={`mr-4 flex h-8 w-8 justify-center ${numOfAdministrations !== 0 ? 'bg-primary' : 'bg-primary-300'} text-white`}
              >
                <span className="font-normal">{numOfAdministrations}</span>
              </Badge>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="font-h2 line-clamp-1 break-all pr-1 text-left text-base">
                    {administrationType}
                  </p>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1" asChild>
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-60 text-left">
                      <p className="text-sm font-normal">{informations}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <p className="text-sm">
                  Ultima somministrazione:
                  <span className="pl-2 text-primary">
                    {lastAdministration}
                  </span>
                </p>
              </div>
            </div>
            <div className="mr-4 flex flex-row items-center gap-2">
              <Toggle
                aria-label="Mostra solo preferiti"
                size="sm"
                pressed={isFavorite}
                onPressedChange={() => toggleFavorite()}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="h-8 w-10 border border-primary text-base text-primary hover:bg-primary/5 [&>svg]:data-[state=on]:fill-primary [&>svg]:data-[state=on]:stroke-white"
                asChild
              >
                <Star className="h-5 w-5" />
              </Toggle>
              <Button
                variant={isAssigned ? 'destructive' : 'outline'}
                size="sm"
                className="w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  void updateAssignedQuestionnaire();
                }}
                asChild
              >
                <div>{isAssigned ? 'Rimuovi assegnazione' : 'Assegna'}</div>
              </Button>

              <Button asChild size={'sm'} className="w-fit">
                <Link href={`${pathname}/nuova/${administrationId}`}>
                  Nuovo
                </Link>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <AdministrationResultsTable
              columns={columns}
              data={administrations}
              compare
              questionnaire={administrationId}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <AssignmentSheet
        className="sr-only"
        sheetProps={{
          open: openSheet,
          onOpenChange: setOpenSheet,
        }}
        assignment={{
          name: administrationId,
          type: 'administration',
        }}
      />
    </>
  );
};
