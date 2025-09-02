'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Diarylayout from '@/features/diaries/components/diarylayout';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export default function SleepEvening() {
  const api = useTRPC();
  const { patient } = usePatient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedDiaryId, setSelectedDiaryId] = React.useState<
    string | undefined
  >(undefined);
  const formattedDate = date ? format(date, 'yyyy-MM-dd') : undefined;

  const { data, refetch } = useQuery(
    api.diaries.find.queryOptions({
      type: 'sleep_evening',
      patientId: patient?.id,
      date: date,
      id: selectedDiaryId,
    }),
  );

  const { data: diaries } = useQuery(
    api.diaries.getAll.queryOptions({
      type: 'sleep_evening',
      patientId: patient?.id,
    }),
  );

  const dailyDiaries = React.useMemo(() => {
    if (!diaries || !date) return [];
    const dateString = format(date, 'yyyy-M-d');
    return diaries.filter((diary) => diary.date === dateString);
  }, [diaries, date]);

  const diaryDates = diaries?.map((diary) => new Date(diary.date));

  React.useEffect(() => {
    if (formattedDate || selectedDiaryId) {
      refetch().catch((error) => {
        console.error('Error refetching data:', error);
      });
    }
  }, [formattedDate, selectedDiaryId, refetch]);

  React.useEffect(() => {
    if (!date || selectedDiaryId) return;

    const formatted = format(date, 'yyyy-M-d');
    const diaryForSelectedDay = dailyDiaries.find((d) => d.date === formatted);

    if (diaryForSelectedDay) {
      setSelectedDiaryId(diaryForSelectedDay.id);
    } else {
      setSelectedDiaryId(undefined);
    }
  }, [date, dailyDiaries, selectedDiaryId]);

  const handleDiaryClick = (diaryId: string) => {
    setSelectedDiaryId(diaryId);
  };

  const createDiary = useMutation(
    api.diaries.create.mutationOptions({
      onSuccess: (data) => {
        queryClient
          .invalidateQueries({
            queryKey: api.diaries.getAll.queryKey({
              type: 'sleep_evening',
              patientId: patient?.id,
            }),
          })
          .catch((error) => {
            console.error('Error invalidating queries:', error);
          });

        const expires = new Date();
        expires.setHours(23, 59, 59, 0);
        document.cookie = `sleep_evening=1; path=/; expires=${expires.toUTCString()}`;

        router.push(`${pathname}/assegnazione/compilazione?id=${data.id}`);
      },
    }),
  );

  const handleCreateNewDiary = () => {
    createDiary.mutate({
      type: 'sleep_evening',
      patientId: patient?.id,
      content: {},
    });
  };

  return (
    <>
      <h1 className="p-4 text-xl font-bold">Diario Sonno-Sera</h1>

      <div className="flex justify-end px-4">
        <Button
          onClick={handleCreateNewDiary}
          className="flex items-center gap-3"
        >
          Nuova compilazione
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-[0.5fr_4fr]">
        <div className="flex h-[70vh] flex-col rounded-[4px] bg-white p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              setSelectedDiaryId(undefined);
            }}
            className="p-2"
            modifiers={{ hasDiary: diaryDates || [] }}
            modifiersClassNames={{
              hasDiary:
                'relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-forest-green-300',
            }}
          />

          <div className="mt-4 flex w-full flex-col overflow-hidden">
            <p className="text-darkest-blue mb-3 text-[20px] font-bold">
              Preview compilazioni
            </p>

            <div className="scrollbar-blue flex-1 overflow-y-auto">
              {dailyDiaries.length > 0 ? (
                dailyDiaries.map((diary) => {
                  const lastUpdate = new Date(diary.updatedAt);
                  const timeString = format(lastUpdate, 'HH:mm');

                  return (
                    <button
                      key={diary.id}
                      onClick={() => handleDiaryClick(diary.id)}
                      className={`mb-2 w-full rounded-[4px] bg-[#F3F6F9] p-3 text-left transition-colors hover:bg-[#D7E1EA] ${
                        selectedDiaryId === diary.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold">
                          Diario delle {timeString}
                        </span>
                        <span
                          className={`w-24 rounded-[8px] px-2 py-1 text-center text-xs font-medium ${
                            diary.state
                              ? 'bg-[#CCDBEF] text-[#004AAD]'
                              : 'bg-[#E2E8F0] text-[#94A3B8]'
                          }`}
                        >
                          {diary.state ? 'Completo' : 'Incompleto'}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">
                  Non sono state effettuate compilazioni
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className={`scrollbar-blue h-[70vh] overflow-y-auto rounded-[4px] bg-white ${
            !data?.content ||
            typeof data.content !== 'object' ||
            Array.isArray(data.content) ||
            !selectedDiaryId ||
            dailyDiaries.length === 0
              ? 'hidden'
              : ''
          }`}
        >
          {dailyDiaries.length > 0 &&
          data?.content &&
          typeof data.content === 'object' &&
          !Array.isArray(data.content) ? (
            <Diarylayout
              key={selectedDiaryId}
              type="sleep_evening"
              compilationTime={format(new Date(data.updatedAt), 'HH:mm')}
              content={
                data.content as {
                  tense: number;
                  sad: number;
                  difficulty: number;
                  tired: number;
                }
              }
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
