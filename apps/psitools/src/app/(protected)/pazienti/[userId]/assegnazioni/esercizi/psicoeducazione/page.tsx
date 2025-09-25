'use client';
import { LessonCard } from '@/features/exercises/components/lesson-card';

export default function psicoeducazione() {
  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Assegnazioni</h1>
      </div>

      <LessonCard
        id="meditazione"
        title="Lezione 1: Combattere l’ansia con la meditazione"
        lastView="23/02/2025"
      />
    </div>
  );
}
