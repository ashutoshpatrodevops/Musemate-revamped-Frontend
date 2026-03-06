'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { museumAdminApi } from '@/lib/museum-admin';
import { MuseumForm } from '@/components/museum-admin/MuseumForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateMuseumPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await museumAdminApi.createMuseum(data, token);

      if (response.success) {
        toast.success(response.message || 'Museum created successfully');
        router.push('/museum-admin/museums');
      } else {
        toast.error(response.message || 'Failed to create museum');
      }
    } catch (err: any) {
      console.error('Error creating museum:', err);
      toast.error(err.message || 'Failed to create museum');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Create Museum</h1>
          <p className="text-muted-foreground mt-2">
            Add a new museum to your listings
          </p>
        </div>
      </div>

      {/* Form */}
      <MuseumForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Museum"
      />
    </div>
  );
}