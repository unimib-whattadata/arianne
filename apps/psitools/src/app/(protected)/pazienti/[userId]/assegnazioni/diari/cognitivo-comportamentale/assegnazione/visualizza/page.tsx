'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import { format } from 'date-fns';

const fieldLabels: Record<string, string> = {
  bheavior: 'Comportamento',
  bodyFeeling: 'Sensazione corporea',
  bodyEmotion: 'Emozione corporea',
  company: 'Compagnia',
  companyPerson: 'Con chi eri',
  context: 'Contesto',
  description: 'Descrizione',
  emotion: 'Emozione',
  intensity: 'Intensità',
  momentDay: 'Momento della giornata',
  place: 'Luogo',
  thought: 'Pensiero',
  unpleasant: 'Esperienza spiacevole',
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
    api.diaries.getAll.queryOptions({
      type: 'cognitive_behavioral',
      patientId: patient?.id,
    }),
  );

  const diary = allDiaries?.find((d) => d.id === diaryId);

  const handleBack = () => {
    router.push(
      `/pazienti/${userId}/diari/cognitivo-comportamentale/assegnazione`,
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
          <h1 className="text-2xl font-bold">
            Diario Cognitivo-Comportamentale
          </h1>
        </div>
        <div className="text-muted-foreground py-8 text-center">
          Diario non trovato.
        </div>
      </div>
    );
  }

  interface DiaryContent {
    bheavior?: string;
    bodyFeeling?: string;
    bodyEmotion?: string;
    company?: string;
    companyPerson?: string;
    context?: string;
    description?: string;
    emotion?: string;
    intensity?: number;
    momentDay?: string;
    place?: string;
    thought?: string;
    unpleasant?: string;
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
        <h1 className="text-2xl font-bold">Diario Cognitivo-Comportamentale</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-success/10">
          <CardTitle>Dettagli Diario</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p>
            <strong>Data:</strong> {format(diary.date, 'dd/MM/yyyy')}
          </p>
          <p>
            <strong>Completato il:</strong>{' '}
            {new Date(diary.updatedAt).toLocaleString('it-IT')}
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
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                {typeof value === 'number' ? (
                  <div className="space-y-2">
                    <div className="bg-muted relative h-2 w-full rounded-full">
                      <div
                        className="bg-forest-green-700 absolute top-0 left-0 h-full rounded-full"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-right text-sm">{value}/10</p>
                  </div>
                ) : (
                  <p>{value}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
