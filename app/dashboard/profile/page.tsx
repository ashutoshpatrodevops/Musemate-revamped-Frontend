// app/dashboard/profile/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Ticket,
  Heart,
  Star,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingVisits: 0,
    totalReviews: 0,
    watchlistCount: 0,
  });

  const [profileData, setProfileData] = useState({
    username: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Get data from unsafeMetadata instead of publicMetadata
      const metadata = user.unsafeMetadata as { phone?: string; address?: string } || {};
      
      setProfileData({
        username: user.username || user.firstName || '',
        phone: metadata.phone || '',
        address: metadata.address || '',
      });
      fetchStats();
    }
  }, [isLoaded, user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Fetch user stats from backend
      setStats({
        totalBookings: 0,
        upcomingVisits: 0,
        totalReviews: 0,
        watchlistCount: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // ⭐ Update username
      if (profileData.username !== user?.username) {
        await user?.update({
          username: profileData.username,
        });
      }

      // ⭐ Update unsafeMetadata (can be updated from client)
      await user?.update({
        unsafeMetadata: {
          phone: profileData.phone,
          address: profileData.address,
        },
      });

      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <DashboardHeader title="Profile" description="Manage your account" />
        <div className="p-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="My Profile"
        description="Manage your account settings and preferences"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={Ticket}
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Upcoming Visits"
              value={stats.upcomingVisits}
              icon={Calendar}
              iconColor="text-green-600"
            />
            <StatsCard
              title="Reviews Written"
              value={stats.totalReviews}
              icon={Star}
              iconColor="text-yellow-600"
            />
            <StatsCard
              title="Watchlist"
              value={stats.watchlistCount}
              icon={Heart}
              iconColor="text-red-600"
            />
          </div>
        )}

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!editing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      // Reset data
                      if (user) {
                        const metadata = user.unsafeMetadata as { phone?: string; address?: string } || {};
                        setProfileData({
                          username: user.username || user.firstName || '',
                          phone: metadata.phone || '',
                          address: metadata.address || '',
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({ ...profileData, username: e.target.value })
                    }
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.emailAddresses[0]?.emailAddress || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed from this page
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({ ...profileData, address: e.target.value })
                    }
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">User ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {user?.id}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-green-600 font-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}