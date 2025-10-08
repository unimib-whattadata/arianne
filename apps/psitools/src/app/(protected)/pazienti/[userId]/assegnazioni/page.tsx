'use client';

import { useQuery } from '@tanstack/react-query';

import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AccordionContent,
  AccordionItem,
} from '@/features/assignments/components/accordion';
import { AssignmentSheet } from '@/features/assignments/components/assignment-sheet';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import type { RouterOutputs } from '@arianne/api';
import { assignmentTypeEnum } from '@arianne/db/schema';

type Assignments = RouterOutputs['assignments']['get'];

export default function AssignmentsPage() {
  const { patient } = usePatient();
  const api = useTRPC();

  const { data: assignments, isLoading } = useQuery(
    api.assignments.get.queryOptions(
      { where: { id: patient!.id } },
      {
        enabled: !!patient,
        select: (data) => {
          const grouped = {} as Record<
            (typeof assignmentTypeEnum.enumValues)[number],
            Assignments
          >;
          for (const type of assignmentTypeEnum.enumValues) {
            grouped[type] = [];
          }

          for (const assignment of data) {
            grouped[assignment.type].push(assignment);
          }

          return grouped;
        },
      },
    ),
  );

  const accordionValue = assignmentTypeEnum.enumValues;

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Assegnazioni</h1>
        <div className="flex justify-end">
          <AssignmentSheet />
        </div>
      </div>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={accordionValue}
      >
        {accordionValue.map((type) => {
          if (isLoading || !assignments) {
            return <Skeleton className="h-14 w-full" key={type} />;
          }

          return (
            <AccordionItem
              key={type}
              type={type}
              assignments={assignments[type]}
            >
              {assignments[type].length > 0 &&
                assignments[type].map((assignment) => (
                  <AccordionContent
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
