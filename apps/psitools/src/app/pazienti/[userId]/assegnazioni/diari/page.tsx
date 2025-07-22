'use client';

import { useQuery } from '@tanstack/react-query';

import { DiaryCard } from '@/features/diaries/components/diarycard';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

type DiaryType =
  | 'sleep_morning'
  | 'sleep_evening'
  | 'cognitive_beahvioral'
  | 'food';

const useDiaryStats = (diaryType: DiaryType, patientId?: string) => {
  const api = useTRPC();

  const { data: diaries } = useQuery(
    api.diary.getAll.queryOptions(
      { type: diaryType, patientId },
      { enabled: !!patientId },
    ),
  );
  const numOfDiaries = diaries?.length || 0;
  const lastDiary = diaries?.length
    ? new Date(
        diaries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0].date,
      ).toLocaleDateString('it-IT')
    : 'N/A';

  return { numOfDiaries, lastDiary };
};

export default function DiariesPagese() {
  const { patient } = usePatient();

  const cognitiveStats = useDiaryStats('cognitive_beahvioral', patient?.id);
  const foodStats = useDiaryStats('food', patient?.id);
  const eveningStats = useDiaryStats('sleep_evening', patient?.id);
  const morningStats = useDiaryStats('sleep_morning', patient?.id);

  //TODO: Add map when we have the rest diary
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <DiaryCard
        diaryType="cognitive_beahvioral"
        numOfDiaries={cognitiveStats.numOfDiaries}
        lastDiary={cognitiveStats.lastDiary}
        diary="cognitivo-comportamentale"
      />
      <DiaryCard
        diaryType="food"
        numOfDiaries={foodStats.numOfDiaries}
        lastDiary={foodStats.lastDiary}
        diary="alimentare"
      />
      <DiaryCard
        diaryType="sleep_evening"
        numOfDiaries={eveningStats.numOfDiaries}
        lastDiary={eveningStats.lastDiary}
        diary="sonno-sera"
      />
      <DiaryCard
        diaryType="sleep_morning"
        numOfDiaries={morningStats.numOfDiaries}
        lastDiary={morningStats.lastDiary}
        diary="sonno-mattina"
      />
    </div>
  );
}
