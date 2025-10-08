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
  nap: 'Hai fatto un pisolino?',
  napDuration: 'Durata del pisolino',
  tense: 'Tensione ',
  exercise: 'Hai fatto attività fisica?',
  caffeine: 'Hai assunto caffeina?',
  caffeineQuantity: 'Quantità di caffeina',
  caffeineTime: 'Orario di assunzione della caffeina',
  alcohol: 'Hai assunto alcol?',
  alcoholQuantity: 'Quantità di alcol',
  alcoholTime: "Orario di assunzione dell'alcol",
  sleepMedications: 'Hai assunto farmaci per dormire?',
  sleepMedicationsQuantity: 'Quantità di farmaci per dormire',
  sleepMedicationsTime: 'Orario di assunzione dei farmaci',
  bedtime: 'Orario in cui sei andato a letto',
  lightsOffTime: 'Orario in cui hai spento la luce',
  sleepLatency: 'Tempo impiegato per addormentarti',
  wakeUpPlanned: 'Orario in cui avevi pianificato di svegliarti',
  wakeUpTime: 'Orario effettivo di risveglio',
  finalNap: "Orario dell'ultimo risveglio notturno",
  outBed: 'Orario in cui sei uscito dal letto',
  awakening: 'Tempo totale sveglio durante la notte',
  nightawake: 'Numero di risvegli notturni',
  timetoWake: 'Tempo impiegato per svegliarti completamente',
  disturbe: 'Disturbi notturni ',
  qualitySleep: 'Qualità del sonno ',
  rest: 'Sensazione di riposo ',
  tired: 'Stanchezza al risveglio ',
  drowsiness: 'Sonnolenza al risveglio ',
  note: 'Note aggiuntive',
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
      type: 'sleep_morning',
      patientId: patient?.id,
    }),
  );

  const diary = allDiaries?.find((d) => d.id === diaryId);

  const handleBack = () => {
    router.push(`/pazienti/${userId}/diari/sonno-mattina/assegnazione`);
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
          <h1 className="text-2xl font-bold">Diario Sonno-Mattina</h1>
        </div>
        <div className="text-muted-foreground py-8 text-center">
          Diario non trovato.
        </div>
      </div>
    );
  }

  interface DiaryContent {
    nap?: string;
    napDuration?: string;
    tense?: number;
    exercise?: string;
    caffeine?: string;
    caffeineQuantity?: string;
    caffeineTime?: string;
    alcohol?: string;
    alcoholQuantity?: string;
    alcoholTime?: string;
    sleepMedications?: string;
    sleepMedicationsQuantity?: string;
    sleepMedicationsTime?: string;
    bedtime?: string;
    lightsOffTime?: string;
    sleepLatency?: string;
    wakeUpPlanned?: string;
    wakeUpTime?: string;
    finalNap?: string;
    outBed?: string;
    awakening?: string;
    nightawake?: string;
    timetoWake?: string;
    disturbe?: number;
    qualitySleep?: number;
    rest?: number;
    tired?: number;
    drowsiness?: number;
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
        <h1 className="text-2xl font-bold">Diario Sonno-Mattina</h1>
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
                <CardTitle className="text-muted-foreground text-[14px] font-medium">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                {typeof value === 'number' ? (
                  <div className="space-y-2">
                    <div className="bg-muted relative h-2 w-full rounded-full">
                      <div
                        className="bg-primary absolute top-0 left-0 h-full rounded-full"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-right text-[14px]">{value}/10</p>
                  </div>
                ) : (
                  <div
                    className="text-[14px] break-words"
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
