'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

import { LessonCard } from '@/features/exercises/components/lesson-card';

export default function psicoeducazione() {
  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Assegnazioni</h1>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="ansia">
          <AccordionTrigger className="flex items-center justify-between border-none bg-transparent hover:no-underline focus:no-underline">
            <div>Ansia</div>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col">
            <LessonCard
              id="meditazione"
              title="Lezione 1: Combattere l’ansia con la meditazione"
              lastView="23/02/2025"
            />
            <LessonCard
              id="lezione2"
              title="Lezione 2: Gestire l’ansia prima di un viaggio"
              lastView="23/02/2025"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="alimentazione">
          <AccordionTrigger className="flex items-center justify-between border-none bg-transparent hover:no-underline focus:no-underline">
            <div>Alimentazione</div>
          </AccordionTrigger>
          <AccordionContent></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
