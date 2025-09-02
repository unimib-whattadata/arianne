'use client';

import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const disorders = [
  'Alimentare',
  'Ansia',
  'Ossessivo',
  'Personalità',
  'UHR FEP',
  'Umore (depressione)',
  'Umore (mania-bipolare)',
  'Trasversale',
];

const sortOptions = [
  { value: 'recent', label: 'Dal più recente' },
  { value: 'oldest', label: 'Dal meno recente' },
  { value: 'az', label: 'Dalla A alla Z' },
  { value: 'za', label: 'Dalla Z alla A' },
];

const statusOptions = [
  { value: 'completed', label: 'Compilato' },
  { value: 'not_completed', label: 'Non compilato' },
];

type Step = 'main' | 'sort' | 'disorder' | 'status';

export const FilterPopover = () => {
  const [step, setStep] = useState<Step>('main');
  const [selectedDisorders, setSelectedDisorders] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [statusOption, setStatusOption] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const toggleDisorder = (disorder: string) => {
    setSelectedDisorders((prev) =>
      prev.includes(disorder)
        ? prev.filter((d) => d !== disorder)
        : [...prev, disorder],
    );
  };

  const hasSelectedFilters =
    selectedDisorders.length > 0 ||
    sortOption !== null ||
    statusOption !== null;

  const clearAllFilters = () => {
    setSelectedDisorders([]);
    setSortOption(null);
    setStatusOption(null);
  };
  return (
    <Popover
      onOpenChange={(open) => {
        setIsFilterActive(open);
        if (open) setStep('main');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsFilterActive(!isFilterActive)}
          className={isFilterActive ? 'w-10 bg-primary text-white' : 'w-10'}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 border border-primary-300 p-3"
        align="start"
        side="right"
      >
        {step === 'main' && (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex flex-row items-start justify-between">
              <h4 className="text-sm font-normal">Aggiungi filtro</h4>
              <Button
                variant="ghost"
                className="h-fit p-0 text-sm font-normal text-primary hover:bg-white hover:text-slate-900"
                onClick={clearAllFilters}
              >
                Cancella
              </Button>
            </div>
            <div className="flex w-full flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full flex-row justify-between p-0 text-[14px]"
                onClick={() => setStep('sort')}
              >
                Ordina per
                <div className="flex gap-2">
                  {sortOption && (
                    <span className="text-xs text-slate-500">
                      {sortOptions.find((o) => o.value === sortOption)?.label}
                    </span>
                  )}
                  <ChevronRight />
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex-row justify-between p-0 text-[14px]"
                onClick={() => setStep('disorder')}
              >
                Disturbo
                <div className="flex gap-2">
                  {selectedDisorders.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {selectedDisorders[0]}
                    </span>
                  )}
                  <ChevronRight />
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex-row justify-between p-0 text-[14px]"
                onClick={() => setStep('status')}
              >
                Stato
                <div className="flex gap-2">
                  {statusOption && (
                    <span className="text-xs text-slate-500">
                      {
                        statusOptions.find((o) => o.value === statusOption)
                          ?.label
                      }
                    </span>
                  )}
                  <ChevronRight />
                </div>
              </Button>
            </div>
            <Button
              className={`mt-4 w-full ${hasSelectedFilters ? 'bg-primary text-white' : 'cursor-not-allowed bg-gray-300 text-gray-500 opacity-50 hover:bg-gray-300'}`}
            >
              Mostra risultati
            </Button>
          </div>
        )}
        {step !== 'main' && (
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronLeft
                className="cursor-pointer"
                onClick={() => setStep('main')}
              />
              <span className="text-sm">
                {step === 'sort'
                  ? 'Ordina per'
                  : step === 'disorder'
                    ? 'Disturbo'
                    : 'Stato'}
              </span>
            </div>
            <Button
              variant="link"
              onClick={() => {
                if (step === 'sort') setSortOption(null);
                if (step === 'disorder') setSelectedDisorders([]);
                if (step === 'status') setStatusOption(null);
              }}
              className="pr-2"
            >
              Cancella
            </Button>
          </div>
        )}
        {step === 'sort' && (
          <div className="flex flex-col gap-3 px-2 pb-2">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-[14px]"
              >
                <Input
                  type="radio"
                  name="sortOption"
                  value={option.value}
                  checked={sortOption === option.value}
                  onChange={() => setSortOption(option.value)}
                  className="h-4 w-4 accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
        {step === 'disorder' && (
          <div className="flex flex-col gap-3 px-2 pb-2">
            {disorders.map((disorder) => (
              <label
                key={disorder}
                className="flex items-center gap-2 text-[14px] leading-none"
              >
                <Checkbox
                  checked={selectedDisorders.includes(disorder)}
                  onCheckedChange={() => toggleDisorder(disorder)}
                  className="border border border-primary-300"
                />
                {disorder}
              </label>
            ))}
          </div>
        )}
        {step === 'status' && (
          <div className="flex flex-col gap-3 px-2 pb-2">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-[14px]"
              >
                <Input
                  type="radio"
                  name="statusOption"
                  value={option.value}
                  checked={statusOption === option.value}
                  onChange={() => setStatusOption(option.value)}
                  className="h-4 w-4 accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
