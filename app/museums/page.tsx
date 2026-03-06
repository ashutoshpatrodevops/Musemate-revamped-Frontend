// app/museums/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, endpoints } from '@/lib/api';
import { Museum } from '@/types';
import { MuseumGrid } from '@/components/museum/MuseumGrid';
import { MuseumGridSkeleton } from '@/components/museum/MuseumSkeleton';
import { MuseumSearch } from '@/components/museum/MuseumSearch';
import { MuseumFilters } from '@/components/museum/MuseumFilters';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function MuseumsPage() {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchMuseums();
  }, [searchParams]);

  const fetchMuseums = async () => {
    setLoading(true);
    try {
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
      const page = searchParams.get('page') || '1';
      
      let endpoint = `${endpoints.museums.list}?page=${page}&limit=12&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }
      
      if (category) {
        endpoint += `&category=${encodeURIComponent(category)}`;
      }

      const response = await api.get<Museum[]>(endpoint);

      if (response.success && response.data) {
        setMuseums(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
      setMuseums([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-10 mt-7">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 mt-5">Explore Museums</h1>
        <p className="text-muted-foreground">
          Discover amazing museums across India
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <MuseumSearch />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <MuseumFilters />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters & Sort
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <MuseumFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {museums.length} of {pagination.total} museums
            </div>
          )}

          {/* Museums Grid */}
          {loading ? (
            <MuseumGridSkeleton count={12} />
          ) : (
            <>
              <MuseumGrid museums={museums} />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="text-sm font-medium px-4">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}