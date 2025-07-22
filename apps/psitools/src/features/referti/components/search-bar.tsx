'use client';

import { Search, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearQuery = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="group relative flex items-center">
      <Input
        placeholder="Cerca referto..."
        type="text"
        value={query}
        onChange={handleChange}
        className="peer w-10 border-primary transition-[color,width] placeholder:text-primary/50 focus-within:w-80 focus-within:pr-9 focus:w-80 focus:pr-9 active:w-80 group-hover:w-80 group-hover:pr-9 [&:not(:placeholder-shown)]:w-80 [&:not(:placeholder-shown)]:pr-9"
      />
      <Search className="absolute right-2.5 top-2 h-5 w-5 bg-background text-primary peer-[&:not(:placeholder-shown)]:hidden" />
      <X
        className="absolute right-2.5 top-2 h-5 w-5 cursor-pointer bg-background text-primary peer-placeholder-shown:hidden"
        onClick={clearQuery}
      />
    </div>
  );
}
