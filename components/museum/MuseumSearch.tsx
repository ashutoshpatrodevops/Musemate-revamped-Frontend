'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function MuseumSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    
    router.push(`/museums?${params.toString()}`);
  };

  return (
    // Inside MuseumSearch.tsx return:
<form onSubmit={handleSearch} className="flex w-full gap-2 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:bg-white transition-all">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="h-10 border-none bg-transparent pl-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  </div>
  <Button type="submit" size="sm" className="rounded-lg px-4 h-10">
    Search
  </Button>
</form>
  );
}