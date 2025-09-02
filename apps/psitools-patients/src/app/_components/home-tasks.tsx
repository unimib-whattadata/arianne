'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { ADMINISTRATION_TYPES } from '@/features/questionnaires/settings';
import { useTRPC } from '@/trpc/react';

interface TaskCardProps {
  taskName: string;
  title: string;
  imgUrl: string;
  date: Date;
  state: 'assigned' | 'in_progress' | 'completed';
}

const TaskCard = (props: TaskCardProps) => {
  const { taskName, title, imgUrl, date, state } = props;
  const stateString =
    state === 'assigned'
      ? 'Assegnato'
      : state === 'completed'
        ? 'Completato'
        : 'Iniziato';

  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-blue-water p-3">
      <div className="flex items-center gap-4">
        <Image
          src={imgUrl}
          alt={`Illustrazione che rappresenta il questionario`}
          width={64}
          height={64}
          className="aspect-square object-cover"
          priority={true}
        />
        <div className="flex flex-col justify-center">
          <h2 className="text-blue-waterTitle">{title}</h2>
          <p className="text-sm">
            Da completare entro il{' '}
            <strong>{format(date, 'PPP', { locale: it })}</strong>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-center font-bold text-blue-waterTitle">
          {stateString}
        </p>
        <Link href={`/questionari/${taskName}`}>
          <Button className="rounded-sm border border-blue-waterTitle bg-transparent font-normal text-blue-waterTitle hover:bg-blue-waterTitle hover:text-white-900">
            Svolgi il compito
          </Button>
        </Link>
      </div>
    </div>
  );
};

interface TasksProps {
  future?: boolean;
}

export const Tasks = (props: TasksProps) => {
  const { future = false } = props;
  const pathname = usePathname();
  const api = useTRPC();
  const { data: assignments, isLoading } = useQuery(
    api.assignments.get.queryOptions(),
  );

  const administration = useMemo(() => {
    return assignments?.filter((a) => a.type === 'administration');
  }, [assignments]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAdministrations =
    administration?.filter((admin) => {
      const eventDate = new Date(admin.date);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate.getTime() === today.getTime();
    }) || [];

  const futureAdministrations =
    administration?.filter((admin) => {
      const eventDate = new Date(admin.date);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate.getTime() > today.getTime();
    }) || [];

  return (
    <section className="grid grid-cols-1 gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold first:mt-0">
          I questionari di oggi
        </h2>
        {pathname === '/' ? (
          <Link href="/questionari">
            <Button variant="link" className="text-blue-waterTitle">
              Vai ai questionari
            </Button>
          </Link>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {administration && todayAdministrations.length == 0 && (
          <p className="mt-4 text-center">Nessun compito assegnato</p>
        )}
        {administration &&
          todayAdministrations.length > 0 &&
          todayAdministrations.map((task, index) => (
            <TaskCard
              key={index}
              taskName={task.name}
              imgUrl="/images/illustrazione-diario-cognitivo-comportamentale.png"
              state={task.state}
              title={
                ADMINISTRATION_TYPES.filter(
                  (administration) => administration.id === task.name,
                )[0]?.name || task.name
              }
              date={task.date}
            />
          ))}
        {future && (
          <p className="text-xl font-semibold">
            I questionari dei prossimi giorni
          </p>
        )}
        {administration && future && futureAdministrations.length == 0 && (
          <p className="text-center">Nessun Compito</p>
        )}
        {administration &&
          future &&
          futureAdministrations.length > 0 &&
          futureAdministrations.map((task, index) => (
            <TaskCard
              key={index}
              taskName={task.name}
              imgUrl="/images/illustrazione-diario-cognitivo-comportamentale.png"
              state={task.state}
              title={task.name}
              date={task.date}
            />
          ))}
      </div>
    </section>
  );
};
