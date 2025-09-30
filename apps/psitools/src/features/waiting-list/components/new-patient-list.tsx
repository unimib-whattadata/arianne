'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Send } from 'lucide-react';
import { NewPatientTable } from '@/features/waiting-list/new-patient/table/table';
import { useColumns } from '@/features/waiting-list/new-patient/table/use-columns';

interface NewPatientsListProps {
  onInviteAgain: () => void;
}

type PatientStatus = 'pending' | 'accepted' | 'rejected';

const NewPatientsList: React.FC<NewPatientsListProps> = () => {
  const columns = useColumns();
  if (!columns) return null;
  const waitingListPatients: {
    name: string;
    email: string;
    date: string;
    status: PatientStatus;
  }[] = [
    {
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      name: 'Luigi Bianchi',
      email: 'luigi.bianchi@example.com',
      date: '2024-01-16',
      status: 'accepted',
    },
    {
      name: 'Giulia Verdi',
      email: 'giulia.verdi@example.com',
      date: '2024-01-17',
      status: 'rejected',
    },
    {
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      name: 'Luigi Bianchi',
      email: 'luigi.bianchi@example.com',
      date: '2024-01-16',
      status: 'accepted',
    },
    {
      name: 'Giulia Verdi',
      email: 'giulia.verdi@example.com',
      date: '2024-01-17',
      status: 'rejected',
    },
    {
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      name: 'Luigi Bianchi',
      email: 'luigi.bianchi@example.com',
      date: '2024-01-16',
      status: 'accepted',
    },
    {
      name: 'Giulia Verdi',
      email: 'giulia.verdi@example.com',
      date: '2024-01-17',
      status: 'rejected',
    },
  ];

  return (
    <Card className="h-fit w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
        <CardTitle className="flex w-full justify-between text-base font-semibold">
          <div className="flex gap-2">
            <Send className="text-primary" />
            Inviti inviati
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NewPatientTable columns={columns} data={waitingListPatients} />
      </CardContent>
    </Card>
  );
};

export default NewPatientsList;
