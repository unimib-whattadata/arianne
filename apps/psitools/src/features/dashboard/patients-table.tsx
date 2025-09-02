'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StateBadge } from '@/features/patient/components/state-badge';
import { useTherapist } from '@/hooks/use-therapist';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';
import type { Tag } from '@arianne/db/schema';

const PatientsTable = () => {
  const { user, isLoading } = useTherapist();

  const api = useTRPC();
  const { data: events } = useQuery(api.events.getAll.queryOptions());

  const { data: patients } = useQuery(
    api.patients.findRecent.queryOptions(
      {
        recent: user?.recentPatients || [],
      },
      {
        enabled: !!user,
      },
    ),
  );

  const getLastVisitDate = (patientId: string) => {
    if (!events) return null;

    const pastEvents = events
      .filter(
        (e) =>
          e.participants[0].id === patientId && new Date(e.date) < new Date(),
      )
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
          className="text-primary px-0 text-[14px] hover:underline"
          href={'/pazienti'}
        >
          Vedi tutti
        </Link>
      </CardHeader>
      <CardContent>
        {/* Header Grid */}
        <div className="bg-muted grid w-full grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 px-4 py-3 text-[14px] font-semibold">
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
              <span className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                {patient.profile?.name || 'Sconosciuto'}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {patient.medicalRecords?.tags?.length ? (
                  patient.medicalRecords.tags
                    .filter(
                      (tag): tag is Tag =>
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
                  state={patient.medicalRecords?.state || 'incoming'}
                />
              </span>
              <Link
                href={`/pazienti/${patient.id}/cartella-clinica`}
                className="text-primary text-right hover:underline"
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
