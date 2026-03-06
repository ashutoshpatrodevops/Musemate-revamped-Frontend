import Link from 'next/link';
import Image from 'next/image';
import { Museum } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MuseumCardProps {
  museum: Museum;
}

export function MuseumCard({ museum }: MuseumCardProps) {
  const lowestPrice = museum.ticketTypes.length > 0 
    ? Math.min(...museum.ticketTypes.map(t => t.price))
    : 0;

  return (
    <Link href={`/museums/${museum._id}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      {/* 1. The Main Background Image */}
      {museum.images && museum.images.length > 0 ? (
        <Image
          src={museum.images[0].url}
          alt={museum.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-secondary">
          <MapPin className="h-12 w-12 text-muted-foreground/20" />
        </div>
      )}

      {/* 2. The Black Faded Overlay (Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

      {/* 3. Top Badges */}
      <div className="absolute top-4 left-4 flex gap-2">
        {museum.isVerified && (
          <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* 4. Bottom Content (Text on top of fade) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-primary px-2 py-0.5 rounded">
            {museum.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{museum.averageRating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold leading-tight mb-2 line-clamp-2">
          {museum.title}
        </h3>

        <div className="flex items-center text-sm text-gray-300 mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
          <span className="truncate">{museum.city}, India</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Starting at</p>
            <p className="text-lg font-bold text-white">{formatCurrency(lowestPrice)}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black transition-transform group-hover:scale-110">
             <span className="text-xl">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}