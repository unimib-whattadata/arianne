'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-picker-range';
import { Toggle } from '@/components/ui/toggle';
import { NoteCard } from '@/features/patient/notes/components/note-card';
import { useNotes } from '@/features/patient/notes/hooks/use-notes';
import {
  dateFilter,
  pinnedFilter,
  sortFn,
  titleFilter,
} from '@/features/patient/notes/utils/filters';

// TODO: add ordering filter
export default function NotesPage() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [pinnedOnly, setPinnedOnly] = useState<boolean>(false);
  const [orderFilter, _setOrderFilter] = useState('desc');

  const { notes, isLoading, isEmpty } = useNotes();

  if (isLoading || !notes) return null;

  return (
    <div className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="sticky top-0 z-10 bg-background pb-3">
        <h1 className="text-xl font-semibold">Note</h1>

        <div className="flex items-center gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Toggle
            aria-label="Mostra solo preferiti"
            size="sm"
            pressed={pinnedOnly}
            onPressedChange={() => setPinnedOnly((prev) => !prev)}
            className="h-9 w-10 border border-primary text-base text-primary hover:bg-primary/5 [&>svg]:data-[state=on]:fill-primary [&>svg]:data-[state=on]:stroke-white"
          >
            <Star className="h-5 w-5" />
          </Toggle>

          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            cleanFn={() => setSearch('')}
            placeholder="Cerca per titolo"
            className="ml-auto"
          />
          <Button asChild>
            <Link href={`${pathname}/nuova`}>Nuova</Link>
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {isEmpty && (
          <Card className="px-4 py-6">
            Nessuna nota è stata inserita per questo paziente.
          </Card>
        )}

        {notes
          .filter((note) => titleFilter(note, search))
          .filter((note) => dateFilter(note, date))
          .filter((note) => pinnedFilter(note, pinnedOnly))
          .sort((a, b) =>
            sortFn(a, b, orderFilter as 'asc' | 'desc' | 'pinned'),
          )
          .map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
      </div>
    </div>
  );
}
