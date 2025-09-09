'use client';

import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

import { Card } from '@/components/ui/card';
import { AdministrationCard } from '@/features/questionnaires/components/administration-card';
import { useSearchBar } from '@/features/questionnaires/hooks/use-searchbar';
import { usePatient } from '@/hooks/use-patient';

export default function AdministrationsPage() {
  const { patient, isLoading } = usePatient();
  const { filteredAdministrationList, SearchBar } = useSearchBar();

  if (isLoading || !patient) return null;
  const administrations = patient.medicalRecords?.administrations;

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Somministrazioni</h1>
        {SearchBar}

        <div className="grid-row grid gap-2">
          {filteredAdministrationList.length === 0 && (
            <Card className="px-4 py-6">
              Non sono state trovate somministrazioni{' '}
            </Card>
          )}
          {filteredAdministrationList.map((type) => {
            const administrationOfThisType =
              administrations?.filter(
                (administration) => administration.type === type.id,
              ) ?? [];

            const numOfAdministrations = administrationOfThisType.length;

            const getLastAdministration = () => {
              if (numOfAdministrations === 0) return 'Mai';

              const lastAdministration = administrationOfThisType[0]?.date;

              if (!lastAdministration) return 'Mai';

              return formatDistanceToNow(lastAdministration, {
                addSuffix: true,
                locale: it,
              });
            };

            return (
              <AdministrationCard
                key={type.name}
                administrationType={type.name}
                administrationId={type.id}
                disorder={type.disorder}
                numOfAdministrations={numOfAdministrations}
                lastAdministration={getLastAdministration()}
                administrations={administrationOfThisType}
                informations={type.info}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
