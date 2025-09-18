'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Link } from 'lucide-react';
import { MatchTable } from '@/features/waiting-list/match/table/table';
import { useColumns } from '@/features/waiting-list/match/table/use-columns';

const PatientRequests = () => {
  const columns = useColumns();
  if (!columns) return null;
  const waitingListPatients: {
    name: string;
    email: string;
    date: string;
  }[] = [
    {
      name: 'Sara Verdi',
      email: 'sara.verdi@example.com',
      date: '2024-04-15',
    },
    {
      name: 'Giorgio Neri',
      email: 'giorgio.neri@example.com',
      date: '2024-02-16',
    },
    {
      name: 'Pietro Gialli',
      email: 'pietro.gialli@example.com',
      date: '2024-03-17',
    },
  ];

  return (
    <Card className="h-fit w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
        <CardTitle className="flex w-full justify-between text-base font-semibold">
          <div className="flex gap-2">
            <Link className="text-primary" />
            Match in attesa di conferma
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MatchTable columns={columns} data={waitingListPatients} />
      </CardContent>
    </Card>
  );
};

export default PatientRequests;
