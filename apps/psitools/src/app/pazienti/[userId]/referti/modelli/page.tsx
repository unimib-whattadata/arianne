'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { SearchBar } from '@/features/referti/components/search-bar';
import { TemplateCard } from '@/features/referti/components/template-card';
import { useFavoritesTemplates } from '@/features/referti/hook/use-favorites-templates';
import { useTRPC } from '@/trpc/react';

export default function ModelliPage() {
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const api = useTRPC();

  const { data: templates, isLoading } = useQuery(
    api.templates.findAll.queryOptions(),
  );

  const { favorites, isLoading: isFavoritesLoading } = useFavoritesTemplates();

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];

    let filtered = [...templates];

    if (searchQuery.trim()) {
      filtered = filtered.filter((template) =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (showOnlyFavorites) {
      filtered = filtered.filter((template) => favorites.includes(template.id));
    }

    return filtered;
  }, [templates, searchQuery, showOnlyFavorites, favorites]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading || isFavoritesLoading) {
    return <div className="p-4 pt-0">Caricamento in corso...</div>;
  }

  return (
    <div className="p-4 pt-0">
      <h1 className="mb-4 text-2xl font-bold">Modelli</h1>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Mostra solo preferiti"
              size="sm"
              pressed={showOnlyFavorites}
              onPressedChange={setShowOnlyFavorites}
              className="h-9 w-10 border border-primary text-base text-primary hover:bg-primary/5 [&>svg]:data-[state=on]:fill-primary [&>svg]:data-[state=on]:stroke-white"
            >
              <Star className="h-5 w-5" />
            </Toggle>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-primary">
            <Link
              href={`${pathname.replace('/modelli', '')}/builder/nuovo?type=template`}
            >
              <Plus />
              Nuovo
            </Link>
          </Button>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Nessun modello trovato
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Inizia creando il tuo primo modello da un referto esistente.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
