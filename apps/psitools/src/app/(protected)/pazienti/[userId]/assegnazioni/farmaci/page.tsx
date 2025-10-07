'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { AssignmentSheet } from '@/features/assignments/components/assignment-sheet';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export default function DrugsPage() {
  const { patient } = usePatient();
  const api = useTRPC();
  const queryClient = useQueryClient();
  console.log('DrugsPage', patient);
  const [openSheet, setOpenSheet] = useState(false);

  const { data: assignments } = useQuery(
    api.assignments.get.queryOptions(
      { where: { id: patient!.id } },
      {
        enabled: !!patient,
        select: (data) =>
          data
            .filter((assignments) => assignments.type === 'drugs')
            .map((assignment) => {
              return {
                id: assignment.id,
                name: assignment.name,
                createdAt: assignment.createdAt,
                recurrence: assignment.recurrence,
              };
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

  const isLoading = !assignments;

  const updateAssignedDrug = (assignmentId: string, name: string) => {
    toast(`Rimuovere l'assegnazione del farmaco ${name}?`, {
      action: {
        label: 'Conferma',
        onClick: () => {
          unassign({ where: { id: assignmentId } });
        },
      },
      cancel: {
        label: 'Annulla',
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  const recurrenceLabels: Record<string, string> = {
    none: 'Mai',
    daily: 'Ogni giorno',
    weekly: 'Ogni settimana',
    monthly: 'Ogni mese',
  };

  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <div className="flex justify-end">
        <Button onClick={() => setOpenSheet(true)}>Nuova </Button>
        <AssignmentSheet
          className="sr-only"
          sheetProps={{ open: openSheet, onOpenChange: setOpenSheet }}
          assignment={{ type: 'drugs' }}
        />
      </div>

      {isLoading && <p>Caricamento...</p>}
      {!isLoading && assignments?.length === 0 && (
        <p className="text-muted-foreground text-sm">Nessuna assegnazione</p>
      )}

      {assignments?.map((assignment) => (
        <div
          key={assignment.id}
          className="flex w-full items-center justify-between rounded-md bg-white p-4"
        >
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-base font-semibold">{assignment.name}</h3>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>
                  Prima assunzione:{' '}
                  <span className="text-primary font-medium">
                    {assignment.createdAt
                      ? format(new Date(assignment.createdAt), 'dd MMMM yyyy', {
                          locale: it,
                        })
                      : '-'}
                  </span>
                </p>
                <p>
                  Ripetizione:{' '}
                  <span className="text-primary font-medium">
                    {recurrenceLabels[assignment.recurrence] || 'Nessuna'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => updateAssignedDrug(assignment.id, assignment.name)}
          >
            Rimuovi assegnazione
          </Button>
        </div>
      ))}
    </div>
  );
}
