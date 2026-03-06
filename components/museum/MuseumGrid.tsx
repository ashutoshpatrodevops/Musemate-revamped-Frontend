// components/museum/MuseumGrid.tsx

import { Museum } from '@/types';
import { MuseumCard } from './MuseumCard';

interface MuseumGridProps {
  museums: Museum[];
}

export function MuseumGrid({ museums }: MuseumGridProps) {
  if (museums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No museums found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {museums.map((museum) => (
        <MuseumCard key={museum._id} museum={museum} />
      ))}
    </div>
  );
}