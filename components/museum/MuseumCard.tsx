import Link from 'next/link';
import Image from 'next/image';
import { Museum } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MuseumCardProps {
  museum: Museum;
}

export function MuseumCard({ museum }: MuseumCardProps) {
  const lowestPrice = museum.ticketTypes.length > 0
    ? Math.min(...museum.ticketTypes.map(t => t.price))
    : 0;

  return (
    <Link
      href={`/museums/${museum._id}`}
      className="group block overflow-hidden rounded-2xl bg-[#FAFAF8] border border-[#E8E4DE] hover:border-[#C9A96E] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F0EDE8]">
        {museum.images?.length > 0 ? (
          <Image
            src={museum.images[0].url}
            alt={museum.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-10 w-10 text-[#C9A96E]/30" />
          </div>
        )}

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Category pill - bottom left over image */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] bg-white/90 backdrop-blur-sm text-[#5C4A2A] px-2.5 py-1 rounded-full">
            {museum.category}
          </span>
        </div>

        {/* Verified badge - top right */}
        {museum.isVerified && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-[#1A6B4A] px-2 py-1 rounded-full">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[15px] font-bold leading-snug text-[#1C1A17] line-clamp-2 group-hover:text-[#C9A96E] transition-colors duration-200 flex-1">
            {museum.title}
          </h3>
          <ArrowUpRight className="h-4 w-4 text-[#C9A96E] shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-[12px] text-[#8A7968] mb-4">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{museum.city}, India</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E8E4DE] mb-4" />

        {/* Bottom row: price + rating */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#A89880] mb-0.5">From</p>
            <p className="text-[17px] font-bold text-[#1C1A17] leading-none">
              {formatCurrency(lowestPrice)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFF8EC] border border-[#F0DDB8] rounded-full px-2.5 py-1">
            <Star className="h-3 w-3 fill-[#C9A96E] text-[#C9A96E]" />
            <span className="text-[12px] font-bold text-[#8A6A2A]">
              {museum.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}