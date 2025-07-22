import type { Table } from '@tanstack/react-table';
import { Filter, Plus, X } from 'lucide-react';
import Link from 'next/link';

import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FilterBarProps<TData> {
  table: Table<TData>;
}

export const FilterBar = <TData,>(props: FilterBarProps<TData>) => {
  const { table } = props;

  const hasFilter = table
    .getAllColumns()
    .some((column) => column.getIsFiltered());

  return (
    <div className="relative flex items-center justify-between gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              hasFilter
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                : ''
            }
          >
            <Filter />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start" side="left">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filtra pazienti</h4>
              <p className="text-sm text-muted-foreground">
                Seleziona i filtri che vuoi applicare alla tabella dei pazienti.
              </p>
            </div>

            <div className="w-[calc(theme(spacing.80)_-_theme(spacing.8))] items-center">
              <Label htmlFor="name" className="font-semibold">
                Stato
              </Label>
              <MultiSelect
                id="state"
                searchable={false}
                defaultValue={
                  table.getColumn('state')?.getFilterValue() as string[]
                }
                value={table.getColumn('state')?.getFilterValue() as string[]}
                onValueChange={(value) => {
                  if (value.length === 0) {
                    return table.getColumn('state')?.setFilterValue(undefined);
                  }
                  return table.getColumn('state')?.setFilterValue(value);
                }}
                options={[
                  { label: 'In entrata', value: 'incoming' },
                  { label: 'In corso', value: 'ongoing' },
                  { label: 'Archiviato', value: 'archived' },
                ]}
                placeholder="Filtra per stato"
              />
            </div>

            <div className="w-[calc(theme(spacing.80)_-_theme(spacing.8))] items-center">
              <Label htmlFor="cod" className="font-semibold">
                Codice ID
              </Label>
              <div className="relative">
                <Input
                  placeholder="Cerca codice ID"
                  id="cod"
                  type="text"
                  value={
                    (table.getColumn('cod')?.getFilterValue() as string) ?? ''
                  }
                  onChange={(event) =>
                    table.getColumn('cod')?.setFilterValue(event.target.value)
                  }
                  className="peer w-full pr-10"
                />
                <X
                  className="absolute right-2.5 top-2 h-5 w-5 cursor-pointer text-primary peer-placeholder-shown:hidden"
                  onClick={() => table.getColumn('cod')?.setFilterValue('')}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={() => table.resetColumnFilters()}>
              Rimuovi tutti i filtri
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <SearchInput
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        cleanFn={() => table.getColumn('name')?.setFilterValue('')}
        placeholder="Cerca per nome"
        className="ml-auto"
      />

      <Button variant="outline" asChild>
        <Link href="/pazienti/nuovo-paziente">
          <Plus />
          Nuovo paziente
        </Link>
      </Button>
    </div>
  );
};
