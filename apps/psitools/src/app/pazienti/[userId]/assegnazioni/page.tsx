'use client';

import type { Assignment } from '@prisma/client';
import { $Enums } from '@prisma/client';
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

export default function DrivePage() {
  const { patient } = usePatient();
  const api = useTRPC();

  const { data: assignments, isLoading } = useQuery(
    api.assignments.get.queryOptions(patient?.id, {
      enabled: !!patient,
      select: (data) => {
        const grouped = {} as Record<$Enums.AssignmentType, Assignment[]>;
        for (const type in $Enums.AssignmentType) {
          grouped[type as $Enums.AssignmentType] = [];
        }

        for (const assignment of data) {
          grouped[assignment.type].push(assignment);
        }

        return grouped;
      },
    }),
  );

  const accordionValue = Object.keys($Enums.AssignmentType);

  return (
    <div className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="sticky top-0 z-10 bg-background pb-3">
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
              type={type as $Enums.AssignmentType}
              assignments={assignments[type as $Enums.AssignmentType]}
            >
              {assignments[type as $Enums.AssignmentType].length > 0 &&
                assignments[type as $Enums.AssignmentType].map((assignment) => (
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
