// components/museum/MuseumFilters.tsx

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MUSEUM_CATEGORIES } from '@/lib/constants';
import { X } from 'lucide-react';

export function MuseumFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const isFeatured = searchParams.get('isFeatured') || 'all';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Don't set 'all' as a filter, just remove the param
    if (value && value !== 'all') {
      params.set(key, value);
      params.delete('page'); // Reset to page 1
    } else {
      params.delete(key);
    }
    
    router.push(`/museums?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/museums');
  };

  const hasFilters =
    category !== 'all' ||
    isFeatured !== 'all' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  return (
    <div className="sticky top-24 self-start space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MUSEUM_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Featured Filter */}
      <div className="space-y-2">
        <Label>Features</Label>
        <Select value={isFeatured} onValueChange={(value) => updateFilter('isFeatured', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Museums" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Museums</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest</SelectItem>
            <SelectItem value="averageRating">Highest Rated</SelectItem>
            <SelectItem value="totalBookings">Frequency</SelectItem>
            <SelectItem value="title">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="space-y-2">
        <Label>Order</Label>
        <Select value={sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}