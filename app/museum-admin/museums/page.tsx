'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MuseumCard } from '@/components/museum-admin/MuseumCard';
import { EmptyState } from '@/components/museum-admin/EmptyState';
import { PlusCircle, Search, AlertCircle } from 'lucide-react';

export default function MuseumsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [filteredMuseums, setFilteredMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadMuseums();
  }, []);

  useEffect(() => {
    filterMuseums();
  }, [searchQuery, statusFilter, museums]);

  const loadMuseums = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await museumAdminApi.getMyMuseums(token);

      if (!response.success || !response.data) {
        setError(response.message || 'Failed to load museums');
        return;
      }

      const museumsData = response.data.data || [];
      setMuseums(museumsData);
      setFilteredMuseums(museumsData);
    } catch (err: any) {
      console.error('Error loading museums:', err);
      setError(err.message || 'Failed to load museums');
    } finally {
      setLoading(false);
    }
  };

  const filterMuseums = () => {
    let filtered = [...museums];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((museum) =>
        museum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        museum.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((museum) => museum.status === statusFilter);
    }

    setFilteredMuseums(filtered);
  };

  const handleDeleteMuseum = async (museumId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await museumAdminApi.deleteMuseum(museumId, token);

      if (response.success) {
        setMuseums(museums.filter((m) => m._id !== museumId));
      } else {
        alert(response.message || 'Failed to delete museum');
      }
    } catch (err: any) {
      console.error('Error deleting museum:', err);
      alert(err.message || 'Failed to delete museum');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Museums</h1>
          <p className="text-muted-foreground mt-2">
            Manage your museum listings and track performance
          </p>
        </div>
        <Button onClick={() => router.push('/museum-admin/museums/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Museum
        </Button>
      </div>

      {/* Filters */}
      {museums.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search museums by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Museums Grid */}
      {filteredMuseums.length === 0 ? (
        museums.length === 0 ? (
          <EmptyState
            title="No museums yet"
            description="Create your first museum to start accepting bookings"
            actionLabel="Create Museum"
            onAction={() => router.push('/museum-admin/museums/create')}
          />
        ) : (
          <EmptyState
            title="No museums found"
            description="Try adjusting your search or filters"
          />
        )
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMuseums.map((museum) => (
              <MuseumCard
                key={museum._id}
                museum={museum}
                onDelete={handleDeleteMuseum}
              />
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredMuseums.length} of {museums.length} museum
            {museums.length !== 1 ? 's' : ''}
          </p>
        </>
      )}
    </div>
  );
}