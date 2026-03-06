'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { api, endpoints } from '@/lib/api';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum } from '@/types';
import { MuseumForm } from '@/components/museum-admin/MuseumForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditMuseumPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const museumId = params.id as string;

  useEffect(() => {
    loadMuseum();
  }, [museumId]);

  const loadMuseum = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Get museum details
      const response = await api.get<Museum>(
        endpoints.museums.detail(museumId),
        token
      );

      if (!response.success || !response.data) {
        setError(response.message || 'Failed to load museum');
        return;
      }

      setMuseum(response.data);
    } catch (err: any) {
      console.error('Error loading museum:', err);
      setError(err.message || 'Failed to load museum');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true);

      const token = await getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await museumAdminApi.updateMuseum(museumId, data, token);

      if (response.success) {
        toast.success('Museum updated successfully');
        router.push('/museum-admin/museums');
      } else {
        toast.error(response.message || 'Failed to update museum');
      }
    } catch (err: any) {
      console.error('Error updating museum:', err);
      toast.error(err.message || 'Failed to update museum');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/museum-admin/museums">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Museum</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Museum not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/museum-admin/museums">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Museum</h1>
          <p className="text-muted-foreground mt-2">
            Update museum information
          </p>
        </div>
      </div>

      {/* Form */}
      <MuseumForm
        initialData={museum}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel="Update Museum"
      />
    </div>
  );
}