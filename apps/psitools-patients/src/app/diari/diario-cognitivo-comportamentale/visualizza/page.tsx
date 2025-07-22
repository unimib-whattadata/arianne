'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTRPC } from '@/trpc/react';

const fieldLabels: Record<string, string> = {
  bheavior: 'Comportamento',
  bodyFeeling: 'Sensazione corporea',
  bodyEmotion: 'Emozione corporea',
  company: 'Compagnia',
  commento: 'Commento',
  companyPerson: 'Con chi eri',
  consumption: 'Consumo',
  context: 'Contesto',
  description: 'Descrizione',
  emotion: 'Emozione',
  intensity: 'Intensità',
  momentDay: 'Momento della giornata',
  place: 'Luogo',
  feeling: 'Sensazione',
  thought: 'Pensiero',
  unpleasant: 'Esperienza spiacevole',
  note: 'Note',
};

export default function ViewDiary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const diaryId = searchParams.get('id');
  const api = useTRPC();

  const { data: allDiaries, isLoading } = useQuery(
    api.diary.getAll.queryOptions({
      type: 'cognitive_beahvioral',
    }),
  );

  const diary = allDiaries?.find((d) => d.id === diaryId);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleBack = () => {
    router.push('/diari/diario-cognitivo-comportamentale');
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
          <h1 className="text-2xl font-bold">
            Diario Cognitivo comportamentale
          </h1>
        </div>
        <div className="py-8 text-center text-muted-foreground">
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
    commento?: string;
    companyPerson?: string;
    consumption?: string;
    context?: string;
    description?: string;
    emotion?: string;
    intensity?: number;
    momentDay?: string;
    place?: string;
    feeling?: string;
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
        <h1 className="text-2xl font-bold">Diario Cognitivo Comportamentale</h1>
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
                <CardTitle className="text-base">{label}</CardTitle>
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
