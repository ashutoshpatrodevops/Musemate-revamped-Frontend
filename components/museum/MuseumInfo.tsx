// components/museum/MuseumInfo.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Museum } from '@/types';
import {
  MapPin,
  Star,
  Eye,
  Phone,
  Mail,
  Globe,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MuseumInfoProps {
  museum: Museum;
}

export function MuseumInfo({ museum }: MuseumInfoProps) {
  const hasContactInfo = museum.contactInfo && (
    museum.contactInfo.phone || 
    museum.contactInfo.email || 
    museum.contactInfo.website
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{museum.category}</Badge>
          {museum.isVerified && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
          {museum.isFeatured && <Badge>Featured</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{museum.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{museum.city}, {museum.state}, {museum.country}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">
              {museum.averageRating.toFixed(1)}
            </span>
            <span>({museum.totalReviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{museum.viewCount} views</span>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {museum.description}
          </p>
        </CardContent>
      </Card>

      {/* Facilities Card */}
      {museum.facilities && museum.facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Facilities & Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {museum.facilities
                .filter((facility) => facility.available)
                .map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{facility.name}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Guide Card */}
      {museum.hasAudioGuide && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Audio Guide Available</p>
                <p className="text-sm text-muted-foreground">
                  {museum.audioGuidePrice
                    ? formatCurrency(museum.audioGuidePrice) + ' per device'
                    : 'Included with admission'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Info Card */}
      {hasContactInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {museum.contactInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={'tel:' + museum.contactInfo.phone}
                  className="text-primary hover:underline"
                >
                  {museum.contactInfo.phone}
                </a>
              </div>
            )}
            {museum.contactInfo.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={'mailto:' + museum.contactInfo.email}
                  className="text-primary hover:underline"
                >
                  {museum.contactInfo.email}
                </a>
              </div>
            )}
            {museum.contactInfo.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={museum.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {museum.totalBookings}
              </div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {museum.dailyCapacity}
              </div>
              <div className="text-sm text-muted-foreground">Daily Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {museum.totalReviews}
              </div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}