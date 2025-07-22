import type { Assignment } from '@prisma/client';
import { $Enums } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar1,
  MoreVertical,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import {
  AccordionContent as AccordionContentBase,
  AccordionItem as AccordionItemBase,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useTRPC } from '@/trpc/react';

import { AssignmentSheet } from './assignment-sheet';

export const AccordionContent = ({
  assignment,
}: {
  assignment: Assignment;
}) => {
  const [open, setOpen] = React.useState(false);
  const api = useTRPC();
  const queryClient = useQueryClient();

  const pathname = usePathname();

  const removeAssignment = useMutation(
    api.assignments.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.assignments.get.queryFilter()); // Check if this is the correct query key or need to be relative to assignments
        toast.success('Assegnazione annullata');
      },
    }),
  );

  const handleUnassign = async (id: string) => {
    await removeAssignment.mutateAsync(id);
  };

  let path = '';
  if (assignment.type === $Enums.AssignmentType.diary) {
    path = `${pathname}/diari/${assignment.name}/assegnazione/compilazione`;
  } else if (assignment.type === $Enums.AssignmentType.administration) {
    path = `${pathname}/somministrazioni/nuova/${assignment.name}`;
  } else if (assignment.type === $Enums.AssignmentType.drugs) {
    path = `${pathname}/farmaci/nuovo/${assignment.name}`;
  }

  return (
    <Card key={assignment.id}>
      <div className="flex items-center justify-between rounded-lg p-3">
        <span className="uppercase">{assignment.name}</span>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {assignment.type !== $Enums.AssignmentType.drugs && (
                <DropdownMenuItem className="text-primary">
                  <Link href={path} className="cursor-default">
                    Compila ora
                  </Link>

                  <SquareArrowOutUpRight className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-primary *:hover:text-foreground"
                onClick={() => setOpen(true)}
              >
                Modifica assegnazione
                <Calendar1 className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUnassign(assignment.id)}
                className="text-destructive focus:text-destructive"
              >
                Annulla assegnazione
                <Trash2 className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AssignmentSheet
            sheetProps={{ open, onOpenChange: setOpen }}
            variant="link"
            label="Modifica assegnazione"
            className="sr-only"
            assignment={assignment}
          />
        </div>
      </div>
    </Card>
  );
};

export const AccordionItem = ({
  assignments,
  type,
  children,
}: {
  assignments: Assignment[];
  type: $Enums.AssignmentType;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const settings = {
    [$Enums.AssignmentType.administration]: {
      title: 'Somministrazioni assegnate',
      link: {
        pathname: `${pathname}/somministrazioni`,
        label: 'Vai alle somministrazioni',
      },
    },
    [$Enums.AssignmentType.diary]: {
      title: 'Diari assegnati',
      link: { pathname: `${pathname}/diari`, label: 'Vai ai diari' },
    },
    [$Enums.AssignmentType.drugs]: {
      title: 'Farmaci assegnati',
      link: { pathname: `${pathname}/farmaci`, label: 'Vai ai farmaci' },
    },
  };

  return (
    <AccordionItemBase value={type} className="border-none">
      <AccordionTrigger
        className="no-underline hover:no-underline"
        iconPosition={assignments.length > 0 ? 'left' : 'none'}
        iconClassName="h-6 w-6"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {settings[type].title}
            <Badge variant="default">{assignments.length ?? 0}</Badge>
          </div>
          <Link
            href={settings[type].link.pathname}
            className="text-primary hover:underline"
          >
            {settings[type].link.label}
          </Link>
        </div>
      </AccordionTrigger>
      <Separator className="mb-2" />
      <AccordionContentBase>
        <div className="flex flex-col gap-2">{children}</div>
      </AccordionContentBase>
    </AccordionItemBase>
  );
};
