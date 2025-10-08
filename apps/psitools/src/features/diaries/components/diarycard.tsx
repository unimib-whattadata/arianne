'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssignmentSheet } from '@/features/assignments/components/assignment-sheet';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

interface Props {
  diaryType:
    | 'sleep_morning'
    | 'sleep_evening'
    | 'cognitive_beahvioral'
    | 'food';
  numOfDiaries: number;
  lastDiary: string;
  diary:
    | 'sonno-mattina'
    | 'sonno-sera'
    | 'cognitivo-comportamentale'
    | 'alimentare';
}

export const DiaryCard = (props: Props) => {
  const { diaryType, numOfDiaries, lastDiary, diary } = props;

  const [openSheet, setOpenSheet] = useState(false);

  const diaryTitles = {
    cognitive_beahvioral: 'Diario cognitivo-comportamentale',
    food: 'Diario alimentare',
    sleep_morning: 'Diario del sonno mattina',
    sleep_evening: 'Diario sonno sera',
  };

  const pathname = usePathname();
  const { patient } = usePatient();
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: assignments } = useQuery(
    api.assignments.get.queryOptions(
      { where: { id: patient?.id } },
      {
        enabled: !!patient,
        select: (data) =>
          data
            .filter((assignments) => assignments.type === 'diary')
            .map((assignment) => {
              return { id: assignment.id, name: assignment.name };
            }),
      },
    ),
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
    return assignment?.name === diary;
  })[0];

  const isAssigned = assignments?.some(
    (assignment) => assignment.name === diary,
  );

  const updateAssignedQuestionnaire = () => {
    if (!patient) return;

    if (isAssigned && assignment) {
      toast(`Rimuovere l'assegnazione del Diario ${diary}?`, {
        action: {
          label: 'Conferma',
          onClick: () => {
            unassign({ where: { id: assignment.id } });
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
    <div className="flex w-full items-center justify-between rounded-md bg-white p-4">
      <div className="flex items-center justify-center gap-4">
        <Badge
          className={cn(
            'bg-primary flex h-8 w-8 items-center justify-center text-white',
            numOfDiaries !== 0 ? 'bg-primary' : 'bg-primary-300',
          )}
        >
          <span className="font-normal">{numOfDiaries}</span>
        </Badge>

        <div>
          <h3 className="text-base font-semibold">
            {diaryTitles[diaryType] || diaryType}
          </h3>
          <p className="text-muted-foreground text-sm">
            Ultima compilazione:{' '}
            <span className="text-forest-green-700 underline">{lastDiary}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isAssigned ? 'destructive' : 'outline'}
          onClick={updateAssignedQuestionnaire}
        >
          {isAssigned ? 'Rimuovi assegnazione' : 'Assegna'}
        </Button>

        <AssignmentSheet
          className="sr-only"
          sheetProps={{
            open: openSheet,
            onOpenChange: setOpenSheet,
          }}
          assignment={{
            name: diary,
            type: 'diary',
          }}
        />

        <Button
          asChild
          size="sm"
          className="bg-primary hover:bg-forest-green-200"
          disabled={numOfDiaries === 0}
        >
          <Link href={`${pathname}/${diary}`}>Visualizza diario</Link>
        </Button>
      </div>
    </div>
  );
};
