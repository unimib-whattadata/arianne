import {
  ChevronLeft,
  ChevronRight,
  FileUp,
  Filter,
  Search,
  Star,
  X,
} from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import ExportSheet from '@/features/questionnaires/components/export-sheet';
import { useExport } from '@/features/questionnaires/context/export-context';
import { ADMINISTRATION_TYPES } from '@/features/questionnaires/settings';
import { usePatient } from '@/hooks/use-patient';

import { useFavoritesAdministrations } from './use-favorites-administrations';

type Step = 'main' | 'sort' | 'disorder' | 'status';

const SearchBarComponent = memo(
  (props: {
    query: string;
    setQuery: (query: string) => void;
    favoritesOnly: boolean;
    setFavoritesOnly: (favorites: boolean) => void;
    clearQuery: () => void;
    isExporting: boolean;
    toggleExport: () => void;
    onProceed: () => void;
    sortOption: string | null;
    setSortOption: (option: string | null) => void;
    statusOption: string | null;
    setStatusOption: (option: string | null) => void;
    selectedDisorders: string[];
    setSelectedDisorders: React.Dispatch<React.SetStateAction<string[]>>;
    completed: string[];
  }) => {
    const {
      exportMode,
      toggleExportMode,
      selectedIds,
      isAllSelected,
      selectAllGlobally,
    } = useExport();

    const isEverithingSelected = props.completed.every((id) => {
      return isAllSelected.get(id)?.isAllSelected;
    });

    const [step, setStep] = useState<Step>('main');
    const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { patient, isLoading } = usePatient();
    if (isLoading || !patient) return <div>Loading...</div>;

    const toggleDisorder = (disorder: string) => {
      props.setSelectedDisorders((prev) =>
        prev.includes(disorder)
          ? prev.filter((d) => d !== disorder)
          : [...prev, disorder],
      );
    };
    const onCancel = () => {
      toggleExportMode();
    };
    const disorders = [
      'Alimentare',
      'Ansia',
      'Ossessivo',
      'Personalità',
      'UHR-FEP',
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

    const clearAllFilters = () => {
      props.setSelectedDisorders([]);
      props.setSortOption(null);
      props.setStatusOption(null);
    };

    const hasActiveFilters =
      props.selectedDisorders.length > 0 ||
      props.sortOption !== null ||
      props.statusOption !== null;

    const openSheet = () => {
      setIsSheetOpen(true);
    };
    const numberOfSelectedIds = selectedIds.length;

    return (
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-gray-10 py-3">
        <div className="flex w-full flex-row justify-between gap-2">
          <div className="flex flex-row">
            <Toggle
              aria-label="Mostra solo preferiti"
              size="sm"
              pressed={props.favoritesOnly}
              onPressedChange={props.setFavoritesOnly}
              className="h-9 w-10 border border-primary text-base text-primary hover:bg-primary/5 [&>svg]:data-[state=on]:fill-primary [&>svg]:data-[state=on]:stroke-white"
            >
              <Star className="h-5 w-5" />
            </Toggle>
          </div>
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
                className={`w-10 ${
                  hasActiveFilters ? 'bg-primary text-white' : ''
                }`}
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
                      className="w-full flex-row justify-between px-0 text-[14px] transition-all hover:bg-muted hover:px-1"
                      onClick={() => setStep('sort')}
                    >
                      Ordina per
                      <div className="flex gap-2">
                        {props.sortOption && (
                          <span className="text-xs text-slate-500">
                            {
                              sortOptions.find(
                                (o) => o.value === props.sortOption,
                              )?.label
                            }
                          </span>
                        )}
                        <ChevronRight />
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full flex-row justify-between px-0 text-[14px] transition-all hover:bg-muted hover:px-1"
                      onClick={() => setStep('disorder')}
                    >
                      Disturbo
                      <div className="flex gap-2">
                        {props.selectedDisorders.length > 0 && (
                          <span className="text-xs text-slate-500">
                            {props.selectedDisorders[0]}
                          </span>
                        )}
                        <ChevronRight />
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full flex-row justify-between px-0 text-[14px] transition-all hover:bg-muted hover:px-1"
                      onClick={() => setStep('status')}
                    >
                      Stato
                      <div className="flex gap-2">
                        {props.statusOption && (
                          <span className="text-xs text-slate-400 hover:text-white/70">
                            {
                              statusOptions.find(
                                (o) => o.value === props.statusOption,
                              )?.label
                            }
                          </span>
                        )}
                        <ChevronRight />
                      </div>
                    </Button>
                  </div>
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
                      if (step === 'sort') props.setSortOption(null);
                      if (step === 'disorder') props.setSelectedDisorders([]);
                      if (step === 'status') props.setStatusOption(null);
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
                        checked={props.sortOption === option.value}
                        onChange={() => props.setSortOption(option.value)}
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
                        checked={props.selectedDisorders.includes(disorder)}
                        onCheckedChange={() => toggleDisorder(disorder)}
                        className="border-1 border border-primary-300"
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
                        checked={props.statusOption === option.value}
                        onChange={() => props.setStatusOption(option.value)}
                        className="h-4 w-4 accent-primary"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
          <div className="group relative ml-auto flex items-center">
            <Input
              placeholder="Somministrazione"
              type="text"
              value={props.query}
              onChange={(e) => props.setQuery(e.target.value)}
              className="peer w-10 border-primary transition-[color,width] placeholder:text-primary/50 focus-within:w-80 focus-within:pr-9 focus:w-80 focus:pr-9 active:w-80 group-hover:w-80 group-hover:pr-9 [&:not(:placeholder-shown)]:w-80 [&:not(:placeholder-shown)]:pr-9"
            />
            <Search className="absolute right-2.5 top-2 h-5 w-5 bg-background text-primary peer-[&:not(:placeholder-shown)]:hidden" />
            <X
              className="absolute right-2.5 top-2 h-5 w-5 cursor-pointer bg-background text-primary peer-placeholder-shown:hidden"
              onClick={props.clearQuery}
            />
          </div>
          <div className="flex">
            <Toggle
              aria-label="Export"
              size="sm"
              pressed={exportMode}
              onPressedChange={toggleExportMode}
              className="h-9 gap-2 border border-primary px-4 text-base text-primary hover:bg-primary/5 hover:text-primary [&>svg]:data-[state=on]:fill-primary [&>svg]:data-[state=on]:stroke-white"
            >
              <FileUp className="h-5 w-5" />
              <span className="text-sm">Export</span>
            </Toggle>
            <ExportSheet
              isOpen={isSheetOpen}
              onClose={() => setIsSheetOpen(false)}
            />
          </div>
        </div>
        {exportMode && (
          <div className="flex w-full items-center justify-between py-2 pl-2">
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isEverithingSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  selectAllGlobally(!isEverithingSelected, e);
                }}
                className="border-1 border border-primary-300"
              />
              Hai selezionato:
              <span className="text-sm text-gray-500">
                {numberOfSelectedIds}{' '}
                {numberOfSelectedIds === 1
                  ? 'somministrazione'
                  : 'somministrazioni'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="bg-gray-300"
                onClick={onCancel}
              >
                Annulla
              </Button>
              <Button onClick={openSheet}>Avanti</Button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default SearchBarComponent;

export const useSearchBar = () => {
  const [query, setQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedDisorders, setSelectedDisorders] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [statusOption, setStatusOption] = useState<string | null>(null);

  const { favorites, isLoading } = useFavoritesAdministrations();

  const clearQuery = () => setQuery('');
  const toggleExport = () => setIsExporting(!isExporting);

  const onProceed = () => {
    console.log("Procedi con l'export");
  };

  const { patient } = usePatient();

  const administrations = patient?.medicalRecord?.administrations ?? [];

  interface Administration {
    id: string;
    T: number | null;
    patientId: string;
    date: Date;
    type: string;
    medicalRecordId: string;
  }

  const countAdministrationsByType = (
    administrations: Administration[],
  ): Record<string, number> => {
    return administrations.reduce(
      (acc, administration) => {
        const { type } = administration;
        if (type) {
          acc[type] = (acc[type] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  };
  const lastAdministrationsByType: Record<string, Date> =
    administrations.reduce(
      (acc, administration) => {
        const { type, date } = administration;

        if (!acc[type] || new Date(date) > new Date(acc[type])) {
          acc[type] = date;
        }

        return acc;
      },
      {} as Record<string, Date>,
    );

  const administrationsCount = countAdministrationsByType(administrations);

  const filter = useCallback(() => {
    let filtered = ADMINISTRATION_TYPES.filter((type) => {
      const searchQuery = query.trim().toLocaleLowerCase();

      const isFavorite =
        favoritesOnly && !isLoading ? favorites?.includes(type.id) : true;

      const matchesQuery = type.name.toLocaleLowerCase().includes(searchQuery);

      return matchesQuery && isFavorite;
    });

    if (selectedDisorders.length > 0) {
      filtered = filtered.filter(
        (type) => type.disorder && selectedDisorders.includes(type.disorder),
      );
    }

    if (sortOption) {
      switch (sortOption) {
        case 'recent':
          filtered = filtered.sort((a, b) => {
            const dateA = lastAdministrationsByType[a.id];
            const dateB = lastAdministrationsByType[b.id];
            return (
              new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime()
            );
          });
          break;
        case 'oldest':
          filtered = filtered.sort((a, b) => {
            const dateA = lastAdministrationsByType[a.id];
            const dateB = lastAdministrationsByType[b.id];
            return (
              new Date(dateA || 0).getTime() - new Date(dateB || 0).getTime()
            );
          });
          break;
        case 'az':
          filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'za':
          filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    if (statusOption) {
      if (statusOption === 'completed') {
        filtered = filtered.filter(
          (type) => (administrationsCount[type.id] ?? 0) > 0,
        );
      } else if (statusOption === 'not_completed') {
        filtered = filtered.filter(
          (type) => (administrationsCount[type.id] ?? 0) === 0,
        );
      }
    }

    return filtered;
  }, [
    favoritesOnly,
    favorites,
    query,
    isLoading,
    sortOption,
    statusOption,
    administrationsCount,
    lastAdministrationsByType,
    selectedDisorders,
  ]);

  const completed = ADMINISTRATION_TYPES.filter(
    (type) => (administrationsCount[type.id] ?? 0) > 0,
  ).map((item) => item.id);

  const props = {
    query,
    setQuery,
    favoritesOnly,
    setFavoritesOnly,
    clearQuery,
    isExporting,
    toggleExport,
    onProceed,
    sortOption,
    setSortOption,
    statusOption,
    setStatusOption,
    selectedDisorders,
    setSelectedDisorders,
    completed,
  };

  const SearchBar = <SearchBarComponent {...props} />;
  return { SearchBar, filteredAdministrationList: filter() };
};
