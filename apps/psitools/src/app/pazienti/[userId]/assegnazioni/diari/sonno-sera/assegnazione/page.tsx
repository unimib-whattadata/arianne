'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export default function Page() {
  const { patient } = usePatient();
  const { userId } = useParams<{ userId: string }>();

  const router = useRouter();
  const pathname = usePathname();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([new Date()]);
  const [activeTab, setActiveTab] = useState('completed');

  const isToday = isSameDay(selectedDate, today);

  useEffect(() => {
    setActiveTab(isToday ? 'in-progress' : 'completed');
  }, [selectedDate, isToday]);

  useEffect(() => {
    const days = [];
    const startDay = subDays(selectedDate, 3);

    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDay, i));
    }

    setCalendarDays(days);
  }, [selectedDate]);

  const { data: allDiaries, isLoading: isLoadingAllDiaries } = useQuery(
    api.diaries.getAll.queryOptions({
      type: 'sleep_evening',
      patientId: patient?.id,
    }),
  );

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

        window.open(`${pathname}/compilazione?id=${data.id}`, '_blank');
      },
    }),
  );

  const goBack = () => router.push(`/pazienti/${userId}/diari`);

  const handlePreviousWeek = () => {
    if (calendarDays.length > 0) {
      const newDate = subDays(calendarDays[0], 1);
      setSelectedDate(newDate);
    }
  };

  const handleNextWeek = () => {
    if (calendarDays.length > 0) {
      const newDate = addDays(calendarDays[calendarDays.length - 1], 1);
      setSelectedDate(newDate);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateNewDiary = () => {
    createDiary.mutate({
      type: 'sleep_evening',

      patientId: patient?.id,

      content: {},
    });
  };

  const hasDiary = (date: Date) => {
    if (!allDiaries) return false;

    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return allDiaries.some((diary) => diary.date === dateStr);
  };

  const getFormattedDateString = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const selectedDateDiaries = allDiaries
    ? allDiaries.filter(
        (diary) => diary.date === getFormattedDateString(selectedDate),
      )
    : [];

  const inProgressDiaries =
    selectedDateDiaries.filter((diary) => !diary.state) || [];
  const completedDiaries =
    selectedDateDiaries.filter((diary) => diary.state) || [];

  const isLoadingDayDiary = isLoadingAllDiaries;

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={goBack} variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Diario Sonno-Sera</h1>
        </div>

        <Button
          onClick={handleCreateNewDiary}
          className="flex items-center gap-2"
          disabled={createDiary.isPending || !isToday}
        >
          {createDiary.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          Nuova compilazione
        </Button>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">
            {calendarDays.length > 0
              ? format(calendarDays[0], 'MMMM yyyy', { locale: it })
              : ''}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => handleDateSelect(day)}
              className={`flex flex-col items-center justify-center rounded-lg p-2 ${
                isSameDay(selectedDate, day)
                  ? 'bg-forest-green-700 text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <span className="text-xs">
                {format(day, 'EEE', { locale: it })}
              </span>
              <span className="text-lg font-semibold">{format(day, 'd')}</span>
              {hasDiary(day) && (
                <span className="bg-forest-green-400 mt-1 h-1 w-1 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={`mb-8 grid w-full ${isToday ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {isToday && <TabsTrigger value="in-progress">In corso</TabsTrigger>}
          <TabsTrigger value="completed">Completati</TabsTrigger>
        </TabsList>

        {isToday && (
          <TabsContent value="in-progress">
            {isLoadingDayDiary ? (
              <div className="flex justify-center py-8">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            ) : inProgressDiaries.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                Nessun diario in corso per il{' '}
                {format(selectedDate, 'dd/MM/yyyy')}. Clicca su "Nuova
                compilazione" per iniziare.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {inProgressDiaries.map((diary) => (
                  <Card key={diary.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="text-lg">Diario in corso</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p>
                          <strong>Data:</strong> {formatDate(diary.date)}
                        </p>
                        <p>
                          <strong>Ultimo aggiornamento:</strong>{' '}
                          {new Date(diary.updatedAt).toLocaleString('it-IT')}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentCookie = document.cookie
                            .split('; ')
                            .find((row) => row.startsWith('sleep_evening='));
                          if (!currentCookie) {
                            const expires = new Date();
                            expires.setHours(23, 59, 59, 0);
                            document.cookie = `sleep_evening=1; path=/; expires=${expires.toUTCString()}`;
                          }
                          router.push(
                            `${pathname}/compilazione?id=${diary.id}`,
                          );
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Continua compilazione
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="completed">
          {isLoadingDayDiary ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : completedDiaries.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              Nessun diario completato per il{' '}
              {format(selectedDate, 'dd/MM/yyyy')}.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {completedDiaries.map((diary) => (
                <Card key={diary.id} className="overflow-hidden">
                  <CardHeader className="bg-success/10">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="text-success h-5 w-5" />
                      Diario completato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Data:</strong> {formatDate(diary.date)}
                      </p>
                      <p>
                        <strong>Completato il:</strong>{' '}
                        {new Date(diary.updatedAt).toLocaleString('it-IT')}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`${pathname}/visualizza?id=${diary.id}`)
                      }
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizza diario
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
