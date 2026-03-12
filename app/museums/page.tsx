import { Suspense } from 'react';
import { MuseumsPage } from './MuseumsPage';
import { MuseumGridSkeleton } from '@/components/museum/MuseumSkeleton';

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto p-10 mt-7"><MuseumGridSkeleton count={12} /></div>}>
      <MuseumsPage />
    </Suspense>
  );
}