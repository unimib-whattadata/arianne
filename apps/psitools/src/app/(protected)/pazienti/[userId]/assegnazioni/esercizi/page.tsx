'use client';

import { ExerciseCard } from '@/features/exercises/components/exercises-card';

import { lessons } from '@/features/exercises/_lessions';

export default function ExercisesPage() {
  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <h1 className="mb-4 text-xl font-semibold">Esercizi</h1>

      <div className="grid gap-4">
        {/* <ExerciseCard
          id="statiAnimo"
          title="Stati d’animo"
          count={0}
          lastView="20/09/2025"
          isAssigned={false}
          isDisabled={true}

        /> */}

        <ExerciseCard
          id="psicoeducazione"
          title="Psicoeducazione"
          count={lessons.length}
          lastView="Mai"
          isAssigned={false}
        />
      </div>
    </div>
  );
}
