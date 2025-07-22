'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

const fieldLabels: Record<string, string> = {
  timeConsumation: 'Tempo di consumo',
  typeConsumation: 'Tipologia di consumo',
  momentDay: 'Momento del Giorno',
  placeConsumption: 'Luogo del consumo',
  place: 'Luogo',
  company: 'Compagnia',
  companyPerson: 'Con chi eri',
  activitycompany: 'Stavi facendo altro durante la consumazione',
  whatActivitycompany: 'Cosa stavi facendo',
  mealConsideration: 'Considerazioni Pasto',
  excessiveQuantity: 'Quantità Eccessiva',
  relevanceConsumption: 'Rilevanza Consumo',
  bodilysensation: 'Sensazione corporea',
  influenceConsumption: 'Influenza consumo',
  reasonInfluence: 'Motivo Influenza',
  PostConsumerBehaviors: 'Comportamenti post consumo',
  physicalActivity: 'Attività fisica',
  PostConsumerEmotions: 'Provato emozioni post consumo',
  durationPhysicalActivity: 'Durata attività fisica',
  typeActivityPhysics: 'Tipo di attività fisica',
  intensity: 'Intensità',
  note: 'Note',
};

export default function ViewDiary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diaryId = searchParams.get('id');
  const { userId } = useParams<{ userId: string }>();

  const api = useTRPC();
  const { patient } = usePatient();

  const { data: allDiaries, isLoading } = useQuery(
    api.diary.getAll.queryOptions({
      type: 'food',
      patientId: patient?.id,
    }),
  );

  const diary = allDiaries?.find((d) => d.id === diaryId);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleBack = () => {
    router.push(`/pazienti/${userId}/diari/alimentare/assegnazione`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6 flex items-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="icon"
            className="mr-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Diario Alimentare</h1>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          Diario non trovato.
        </div>
      </div>
    );
  }

  interface DiaryContent {
    timeConsumation?: string;
    typeConsumation?: string;
    momentDay?: string;
    placeConsumption?: string;
    place?: string;
    company?: string;
    companyPerson?: string;
    activitycompany?: string;
    whatActivitycompany?: string;
    mealConsideration?: string;
    excessiveQuantity?: string;
    relevanceConsumption?: string;
    bodilysensation?: string;
    influenceConsumption?: string;
    reasonInfluence?: string;
    PostConsumerBehaviors?: string;
    physicalActivity?: string;
    PostConsumerEmotions?: string;
    durationPhysicalActivity?: string;
    typeActivityPhysics?: string;
    intensity?: number;
    note?: string;
  }

  const content = diary.content as DiaryContent;

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="mb-6 flex items-center">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="mr-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Diario Alimentare</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-success/10">
          <CardTitle>Dettagli Diario</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p>
            <strong>Data:</strong> {formatDate(diary.date)}
          </p>
          <p>
            <strong>Completato il:</strong>{' '}
            {new Date(diary.lastUpdate).toLocaleString('it-IT')}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => {
          if (!value || value === '' || value === 0) return null;

          const label = fieldLabels[key] || key;

          return (
            <Card key={key}>
              <CardHeader className="py-3">
                <CardTitle className="text-[14px] font-medium text-muted-foreground">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                {typeof value === 'number' ? (
                  <div className="space-y-2">
                    <div className="relative h-2 w-full rounded-full bg-muted">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-primary"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-right text-[14px]">{value}/10</p>
                  </div>
                ) : (
                  <div
                    className="break-words text-[14px]"
                    dangerouslySetInnerHTML={{ __html: String(value) }}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
