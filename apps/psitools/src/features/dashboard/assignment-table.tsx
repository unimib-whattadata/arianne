import type { Assignment } from '@prisma/client';
import { $Enums } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMINISTRATION_TYPES } from '@/features/questionnaires/settings';
import { useTherapist } from '@/hooks/use-therapist';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

const AssignmentTable: React.FC = () => {
  const { user, isLoading } = useTherapist();

  const api = useTRPC();

  const { data: assignments } = useQuery(api.assignments.latest.queryOptions());
  const getAssignmentStatus = (assignment: Assignment) => {
    const today = new Date();
    const assignDate = new Date(assignment.date);

    if (
      assignment.state === 'assigned' &&
      assignDate.toDateString() > today.toDateString()
    )
      return 'Completato';
    if (
      assignment.state === 'assigned' &&
      assignDate.toDateString() === today.toDateString()
    )
      return 'In corso';
    return 'Assegnato';
  };

  const badgeStyle = {
    Assegnato: 'bg-[#ccdbef] text-[#004aad]',
    'In corso': 'bg-[#fdf4d0] text-[#ecae00]',
    Completato: 'bg-[#e0ede3] text-[#63a375]',
  };

  const assigmentTypeEnum = {
    [$Enums.AssignmentType.diary]: 'Diario',
    [$Enums.AssignmentType.administration]: 'Somministrazione',
    [$Enums.AssignmentType.drugs]: 'Farmaco',
  };

  const getSheetTitle = (assignment?: Partial<Assignment>) => {
    if (!assignment) return 'Nuova Assegnazione';
    if (assignment.type === $Enums.AssignmentType.administration) {
      const available = ADMINISTRATION_TYPES.find(
        (item) => item.id === assignment.name,
      );

      return `${assigmentTypeEnum[assignment.type]} ${available?.name || assignment.name}`;
    }
    if (assignment.type === $Enums.AssignmentType.diary) {
      return `${assigmentTypeEnum[assignment.type]} ${assignment.name}`;
    }
    if (assignment.type === $Enums.AssignmentType.drugs) {
      return `${assigmentTypeEnum[assignment.type]} ${assignment.name}`;
    }
  };

  if (isLoading || !user || !assignments) return null;
  return (
    <Card className="h-fit w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-semibold">Assegnazioni</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Header Grid */}
        <div className="grid w-full grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 bg-muted px-4 py-3 text-[14px] font-semibold">
          <p>Assegnazioni</p>
          <p>Paziente</p>
          <p>Data</p>
          <p>Stato</p>
        </div>

        <div className="grid w-full text-[14px]">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className={cn(
                'grid grid-cols-[1fr_1fr_1fr_1fr_40px] items-center gap-4 px-4 py-3',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              )}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {getSheetTitle(assignment)}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {assignment.patient?.user?.name || 'Sconosciuto'}
              </span>
              <span>{new Date(assignment.date).toLocaleDateString()}</span>
              <span>
                <Badge
                  className={cn(
                    'text-xs',
                    'bg-muted text-muted-foreground',
                    badgeStyle[getAssignmentStatus(assignment)],
                  )}
                  variant="default"
                >
                  {getAssignmentStatus(assignment)}
                </Badge>
              </span>
              <Link
                href={`/pazienti/${assignment.patientId}/assegnazioni`}
                className="text-right text-primary hover:underline"
              >
                Apri
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentTable;
