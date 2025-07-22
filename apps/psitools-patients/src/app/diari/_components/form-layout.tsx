'use client';

import type { DiaryTypeSchema } from '@arianne/db';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { DeepPartial, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTRPCClient } from '@/trpc/react';
import { debounce } from '@/utils/debounce';

interface FormLayoutProps<T extends FieldValues> {
  children: React.ReactNode;
  type: z.infer<typeof DiaryTypeSchema>;
  steps: number;
  methods: ReturnType<typeof useForm<T>>;
  defaultStep?: string;
  diaryId?: string | null;
}

enum Title {
  food = 'Diario alimentare',
  cognitive_beahvioral = 'Diario cognitivo-comportamentale',
  sleep_morning = 'Diario del sonno (mattina)',
  sleep_evening = 'Diario del sonno (sera)',
}

interface StepContextType {
  steps: number;
  currentStep: number;
  setCurrentStep: (value: number | ((value: number) => number)) => void;
  direction: 1 | -1;
  diaryId?: string | null;
}

export const StepsContext = createContext<StepContextType>(
  {} as StepContextType,
);

export const useSteps = () => useContext(StepsContext);

export function FormLayout<T extends FieldValues>(props: FormLayoutProps<T>) {
  const client = useTRPCClient();
  const searchParams = useSearchParams();

  const isInNewTab = searchParams.get('hideUI') === 'true';

  const [diaryId, setDiaryId] = useState<string | undefined>(
    props.diaryId as string | undefined,
  );

  useEffect(() => {
    const fetchDiary = async () => {
      if (props.diaryId) {
        setDiaryId(props.diaryId);
        return;
      }

      const diary = await client.diary.find.query({
        type: props.type,
      });

      if (diary) {
        setDiaryId(diary.id);
      } else {
        const newDiary = await client.diary.create.mutate({
          type: props.type,
          content: {},
        });
        setDiaryId(newDiary.id);
      }
    };

    if (!diaryId) {
      void fetchDiary();
    }
  }, [client, props.type, props.diaryId, diaryId]);

  const autoSaveData = debounce(async (data: DeepPartial<T>) => {
    if (diaryId) {
      await client.diary.update.mutate({
        id: diaryId,
        content: data,
      });
    }
  }, 3000);

  const { watch, getValues } = props.methods;

  useEffect(() => {
    const subscription = watch((data) => {
      if (!data) return;
      void autoSaveData(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, autoSaveData]);

  const [direction, setDirection] = useState<1 | -1>(1);

  const defaultStep = props.defaultStep ? +props.defaultStep : 1;
  const [currentStep, _setCurrentStep] = useState(defaultStep);
  const setCurrentStep = useCallback(
    (value: number | ((value: number) => number)) => {
      const currentStepState =
        typeof value === 'function' ? value(currentStep) : value;

      _setCurrentStep(currentStepState);

      const expires = new Date();
      expires.setHours(23, 59, 59, 0);
      document.cookie = `${props.type}=${currentStepState}; path=/; expires=${expires.toUTCString()}`;
    },
    [currentStep, props.type],
  );

  const handleBack = () => {
    if (currentStep === 1) return null;

    setDirection(-1);

    setCurrentStep((prev) => {
      if (prev - 1 > 0) return prev - 1;
      return prev;
    });
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => {
      if (prev + 1 <= props.steps) return prev + 1;
      return prev;
    });
  };

  const openInNewTab = () => {
    if (!diaryId) return;

    const currentUrl = window.location.href;

    const newUrl = new URL(currentUrl);

    newUrl.searchParams.set('hideUI', 'true');

    window.open(newUrl.toString(), '_blank');
  };

  const updateDiary = useMutation({
    mutationFn: async () => {
      if (diaryId) {
        return await client.diary.update.mutate({
          id: diaryId,
          content: getValues(),
          state: true,
        });
      } else {
        throw new Error('Errore: ID del diario non disponibile');
      }
    },
    onSuccess: () => {
      console.log('Diario completato');
      setCurrentStep((prev) => prev + 1);
    },
    onError: (error) => {
      console.error("C'è un errore", error);
    },
  });

  const handleSave = () => {
    updateDiary.mutate();
  };

  const bar = useRef<HTMLDivElement>(null);

  const isPenultimateStep = currentStep === props.steps - 1;

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div>
          {currentStep === 1 ? null : (
            <Button onClick={handleBack} variant="ghost" size="default">
              Indietro
            </Button>
          )}
        </div>

        <div>
          {isPenultimateStep ? (
            <Button onClick={handleSave} disabled={updateDiary.isPending}>
              {updateDiary.isPending ? 'Salvando...' : 'Salva'}
            </Button>
          ) : currentStep < props.steps - 1 ? (
            <div className="flex gap-2">
              {!isInNewTab && (
                <Button
                  variant="outline"
                  onClick={openInNewTab}
                  disabled={!diaryId}
                >
                  Apri in una nuova scheda
                </Button>
              )}
              <Button onClick={handleNext}>Continua</Button>
            </div>
          ) : null}
        </div>
      </div>
      <section className="grid h-[calc(100svh_-_var(--header-height))] grid-rows-[auto,1fr,auto]">
        <header className="grid gap-2 pb-4">
          <div className="px-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xs">Nuova Compilazione</h2>
                  <h2 className="text-lg font-semibold">{Title[props.type]}</h2>
                </div>
              </div>
            </nav>

            <div
              ref={bar}
              className="relative mt-2 h-2 w-full rounded-full bg-card"
            >
              <div
                style={{
                  width: `${(currentStep / props.steps) * 100}%`,
                }}
                suppressHydrationWarning
                className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
              />
            </div>
          </div>
        </header>

        <StepsContext.Provider
          value={{
            steps: props.steps,
            currentStep,
            setCurrentStep,
            direction,
            diaryId,
          }}
        >
          <Form {...props.methods}>{props.children}</Form>
        </StepsContext.Provider>
      </section>
    </>
  );
}

export function getDefaultsFromSchema<Schema extends z.AnyZodObject>(
  schema: Schema,
) {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, ''];
    }),
  );
}
