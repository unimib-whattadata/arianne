'use client';

import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTherapist } from '@/hooks/use-therapist';

const StatsBar = () => {
  const { user, isLoading } = useTherapist();
  if (isLoading || !user) return null;
  const patientsNumber: number = user.patients.length;

  const incomingPatients = user.patients.filter(
    (patient) => patient.medicalRecord?.state === 'incoming',
  );

  const highRiskPatients = user.patients.filter(
    (patient) => patient.medicalRecord?.highRisk === true,
  );

  return (
    <div className="flex w-full gap-3">
      <Card className="w-full">
        <CardHeader className="flex w-full flex-row items-end justify-between space-y-0">
          <CardTitle className="text-base"> Pazienti totali</CardTitle>
          <Link
            className="px-0 text-[14px] text-primary hover:underline"
            href={'/pazienti'}
          >
            Vedi tutti
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-primary">
            {patientsNumber}
          </p>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Nuovi</CardTitle>
          <Link
            className="px-0 text-[14px] text-primary hover:underline"
            href={'/pazienti'}
          >
            Vedi tutti
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-primary">
            {incomingPatients.length}
          </p>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">High-Risk</CardTitle>
          <Link
            className="px-0 text-[14px] text-primary hover:underline"
            href={'/pazienti'}
          >
            Vedi tutti
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-[#e55934]">
            {highRiskPatients.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsBar;
