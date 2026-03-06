'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { api, endpoints } from '@/lib/api';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum, MuseumStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Edit,
  Calendar,
  IndianRupee,
  Users,
  Star,
  Eye,
  MapPin,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MuseumDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [stats, setStats] = useState<MuseumStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const museumId = params.id as string;

  useEffect(() => {
    loadMuseumData();
  }, [museumId]);

  const loadMuseumData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Load museum details and stats in parallel
      const [museumRes, statsRes] = await Promise.all([
        api.get<Museum>(endpoints.museums.detail(museumId), token),
        museumAdminApi.getMuseumStats(museumId, token),
      ]);

      if (!museumRes.success || !museumRes.data) {
        setError(museumRes.message || 'Failed to load museum');
        return;
      }

      setMuseum(museumRes.data);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      console.error('Error loading museum:', err);
      setError(err.message || 'Failed to load museum');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Museum not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue.toLocaleString('en-IN') || 0}`,
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings.toLocaleString() || '0',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${stats?.recentBookings || 0} this month`,
    },
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors.toLocaleString() || '0',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subtitle: `${stats?.totalReviews || 0} reviews`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{museum.title}</h1>
              <Badge className={getStatusColor(museum.status)}>
                {museum.status.replace('_', ' ')}
              </Badge>
              {museum.isFeatured && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span>
                {museum.city}, {museum.country}
              </span>
              <span className="mx-2">•</span>
              <Eye className="h-4 w-4" />
              <span>{museum.viewCount} views</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/museum-admin/bookings/${museum._id}`}>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Bookings
            </Button>
          </Link>
          <Link href={`/museum-admin/museums/${museum._id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Museum
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.change && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {card.change}
                  </p>
                )}
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Museum Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {museum.images && museum.images.length > 0 && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={museum.images[0].url}
                  alt={museum.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{museum.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category</span>
                <p className="font-medium">{museum.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Daily Capacity</span>
                <p className="font-medium">{museum.dailyCapacity} visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Last 30 days overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed Bookings</span>
                <span className="font-semibold">{stats?.completedBookings || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recent Bookings (30d)</span>
                <span className="font-semibold">{stats?.recentBookings || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reviews</span>
                <span className="font-semibold">{stats?.totalReviews || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">View Count</span>
                <span className="font-semibold">{stats?.viewCount || 0}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href={`/museum-admin/analytics?museum=${museum._id}`}>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Types */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Types & Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {museum.ticketTypes.map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{ticket.type}</p>
                  {ticket.description && (
                    <p className="text-xs text-muted-foreground">{ticket.description}</p>
                  )}
                </div>
                <span className="font-bold">₹{ticket.price}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Object.entries(museum.operatingHours).map(([day, hours]) => (
              <div
                key={day}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium capitalize">{day}</span>
                <span className={hours.isClosed ? 'text-muted-foreground' : ''}>
                  {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities & Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {museum.facilities.map((facility, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 border rounded-lg"
              >
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">{facility.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Address</h4>
              <p className="text-sm text-muted-foreground">
                {museum.location}
                <br />
                {museum.city}, {museum.state} {museum.zipCode}
                <br />
                {museum.country}
              </p>
            </div>
            {museum.contactInfo && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Contact Details</h4>
                {museum.contactInfo.phone && (
                  <p className="text-sm text-muted-foreground">
                    Phone: {museum.contactInfo.phone}
                  </p>
                )}
                {museum.contactInfo.email && (
                  <p className="text-sm text-muted-foreground">
                    Email: {museum.contactInfo.email}
                  </p>
                )}
                {museum.contactInfo.website && (
                  <p className="text-sm text-muted-foreground">
                    Website:{' '}
                    <a
                      href={museum.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {museum.contactInfo.website}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}