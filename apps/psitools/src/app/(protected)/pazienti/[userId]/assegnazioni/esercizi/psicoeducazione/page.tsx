'use client';
import { LessonCard } from '@/features/exercises/components/lesson-card';

import { lessons } from '@/features/exercises/_lessions';

export default function psicoeducazione() {
  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Psicoeducazione</h1>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <LessonCard
            key={lesson.slug}
            id={lesson.slug}
            title={`Lezione ${index + 1}: ${lesson.Title()}`}
            lastView="Mai visualizzata"
          />
        ))}
      </div>
    </div>
  );
}
