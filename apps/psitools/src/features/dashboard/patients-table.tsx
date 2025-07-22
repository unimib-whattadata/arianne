'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StateBadge } from '@/features/patient/components/state-badge';
import { useTherapist } from '@/hooks/use-therapist';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

const PatientsTable = () => {
  const { user, isLoading } = useTherapist();

  const api = useTRPC();
  const { data: events } = useQuery(api.event.getAll.queryOptions());

  const { data: patients } = useQuery(
    api.patient.findMany.queryOptions(
      {
        recent: user?.recentPatients,
      },
      {
        enabled: !!user,
      },
    ),
  );

  const getLastVisitDate = (patientId: string) => {
    if (!events) return null;

    const pastEvents = events
      .filter((e) => e.patientId === patientId && new Date(e.date) < new Date())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return pastEvents.length ? new Date(pastEvents[0].date) : null;
  };

  if (isLoading || !user || !patients) return null;

  return (
    <Card className="h-fit w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">
          Pazienti Recenti
        </CardTitle>
        <Link
          className="px-0 text-[14px] text-primary hover:underline"
          href={'/pazienti'}
        >
          Vedi tutti
        </Link>
      </CardHeader>
      <CardContent>
        {/* Header Grid */}
        <div className="grid w-full grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 bg-muted px-4 py-3 text-[14px] font-semibold">
          <p>Paziente</p>
          <p>Tag</p>
          <p>Ultima visita</p>
          <p>Stato</p>
        </div>

        <div className="grid w-full text-[14px]">
          {patients.map((patient, index) => (
            <div
              key={index}
              className={cn(
                'grid grid-cols-[1fr_1fr_1fr_1fr_40px] items-center gap-4 px-4 py-3',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              )}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {patient.user?.name || 'Sconosciuto'}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {patient.medicalRecord?.tags?.length ? (
                  patient.medicalRecord.tags
                    .filter(
                      (tag): tag is PrismaJson.TagType =>
                        typeof tag === 'object' &&
                        tag !== null &&
                        'text' in tag,
                    )
                    .map((tag, i, arr) => (
                      <span key={i}>
                        {tag.text}
                        {i < arr.length - 1 && ', '}
                      </span>
                    ))
                ) : (
                  <span>—</span>
                )}
              </span>

              <span>
                {(() => {
                  const lastVisit = getLastVisitDate(patient.id);
                  return lastVisit ? lastVisit.toLocaleDateString() : '—';
                })()}
              </span>

              <span>
                <StateBadge
                  state={patient.medicalRecord?.state || 'incoming'}
                />
              </span>
              <Link
                href={`/pazienti/${patient.id}/cartella-clinica`}
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

export default PatientsTable;
