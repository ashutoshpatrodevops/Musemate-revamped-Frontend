// app/dashboard/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api, endpoints } from '@/lib/api';
import type { Booking, Museum, UserStats } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon, Mail, Phone, MapPin, Calendar,
  Edit3, Save, Ticket, Heart, Star, X, Shield,
  CheckCircle2, Hash, TrendingUp, Camera,
} from 'lucide-react';

/* ── tiny fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ── Stat card ── */
function StatPill({
  icon: Icon, label, value, color, delay,
}: {
  icon: React.ElementType; label: string; value: number; color: string; delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative group rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-5 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* glow */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${color}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-opacity-15`}>
          <Icon className="w-4 h-4 text-foreground/80" />
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/40" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
    </motion.div>
  );
}

/* ── Field row ── */
function FieldRow({
  icon: Icon, label, id, value, disabled, note, onChange, type = 'text',
}: {
  icon: React.ElementType; label: string; id: string; value: string;
  disabled: boolean; note?: string; onChange?: (v: string) => void; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          className={[
            'pl-10 h-11 rounded-xl border-border/50 bg-background/80 text-sm transition-all',
            'focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
            disabled ? 'opacity-60 cursor-not-allowed bg-muted/30' : 'hover:border-border',
          ].join(' ')}
        />
      </div>
      {note && <p className="text-[11px] text-muted-foreground/60">{note}</p>}
    </div>
  );
}

/* ── Main Page ── */
export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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
    const syncProfileAndStats = async () => {
      if (!isLoaded) return;

      if (!user) {
        setLoading(false);
        return;
      }

      const metadata = user.unsafeMetadata as { phone?: string; address?: string } || {};
      setProfileData({
        username: user.username || user.firstName || '',
        phone: metadata.phone || '',
        address: metadata.address || '',
      });

      try {
        const token = await getToken();
        if (!token) return;

        const [statsResponse, upcomingResponse, watchlistResponse] = await Promise.all([
          api.get<UserStats>(endpoints.users.stats, token),
          api.get<Booking[]>(endpoints.bookings.upcoming, token),
          api.get<Museum[]>(endpoints.users.watchlist, token),
        ]);

        setStats({
          totalBookings: statsResponse.success ? (statsResponse.data?.totalBookings ?? 0) : 0,
          upcomingVisits: upcomingResponse.success ? upcomingResponse.data?.length ?? 0 : 0,
          totalReviews: statsResponse.success ? (statsResponse.data?.totalReviews ?? 0) : 0,
          watchlistCount: watchlistResponse.success ? watchlistResponse.data?.length ?? 0 : 0,
        });
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      } finally {
        setLoading(false);
      }
    };

    syncProfileAndStats();
  }, [getToken, isLoaded, user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profileData.username !== user?.username) {
        await user?.update({ username: profileData.username });
      }
      await user?.update({
        unsafeMetadata: { phone: profileData.phone, address: profileData.address },
      });
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      const metadata = user.unsafeMetadata as { phone?: string; address?: string } || {};
      setProfileData({
        username: user.username || user.firstName || '',
        phone: metadata.phone || '',
        address: metadata.address || '',
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen">
      <DashboardHeader title="My Profile" description="Manage your account settings and preferences" />

      <div className="p-4 md:p-6 space-y-6 max-w-5xl">

        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-3xl overflow-hidden border border-border/40"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--primary)/0.04) 50%, transparent 100%)' }}
        >
          {/* Background orbs */}
          <div className="absolute top-0 right-0 w-[400px] h-[200px] rounded-full blur-[80px] opacity-25"
            style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-[30%] w-[300px] h-[150px] rounded-full blur-[60px] opacity-15"
            style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />

          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-xl">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <UserIcon className="w-10 h-10 text-primary" />
                  </div>
                )}
              </div>
              {/* Camera overlay */}
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight truncate">
                  {user?.firstName} {user?.lastName}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                @{user?.username || user?.firstName?.toLowerCase()} · Member since {memberSince}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-border/50 bg-background/60 text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {user?.emailAddresses[0]?.emailAddress}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-border/50 bg-background/60 text-muted-foreground">
                  <Shield className="w-3 h-3 text-primary" /> Secure Account
                </span>
              </div>
            </div>

            {/* Edit / Save buttons */}
            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="rounded-xl gap-2 border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} className="rounded-xl gap-1.5">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-xl gap-1.5">
                    {saving ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                        Saving…
                      </span>
                    ) : (
                      <><Save className="w-3.5 h-3.5" /> Save Changes</>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Stats row ────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatPill icon={Ticket}   label="Total Bookings"  value={stats.totalBookings}  color="bg-blue-500"   delay={0.08} />
            <StatPill icon={Calendar} label="Upcoming Visits" value={stats.upcomingVisits} color="bg-emerald-500" delay={0.14} />
            <StatPill icon={Star}     label="Reviews Written" value={stats.totalReviews}   color="bg-amber-500"  delay={0.20} />
            <StatPill icon={Heart}    label="Watchlist Items" value={stats.watchlistCount} color="bg-rose-500"   delay={0.26} />
          </div>
        )}

        {/* ── Profile form ─────────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.15)} className="rounded-3xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 border-b border-border/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Personal Information</p>
              <p className="text-xs text-muted-foreground">Your public profile details</p>
            </div>
            {editing && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                Editing
              </motion.span>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldRow
              icon={UserIcon} label="Username" id="username"
              value={profileData.username} disabled={!editing}
              onChange={v => setProfileData(p => ({ ...p, username: v }))}
            />
            <FieldRow
              icon={Mail} label="Email Address" id="email"
              value={user?.emailAddresses[0]?.emailAddress || ''}
              disabled={true}
              note="Email address is managed by your auth provider"
            />
            <FieldRow
              icon={Phone} label="Phone Number" id="phone"
              value={profileData.phone} disabled={!editing}
              onChange={v => setProfileData(p => ({ ...p, phone: v }))}
              type="tel"
            />
            <FieldRow
              icon={MapPin} label="Address" id="address"
              value={profileData.address} disabled={!editing}
              onChange={v => setProfileData(p => ({ ...p, address: v }))}
            />
          </div>
        </motion.div>

        {/* ── Account meta ─────────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.22)} className="rounded-3xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Account Details</p>
              <p className="text-xs text-muted-foreground">System and security information</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User ID */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/30 bg-muted/20 group hover:border-border/60 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border/40">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">User ID</p>
                <p className="text-xs font-mono text-foreground/70 truncate">{user?.id}</p>
              </div>
            </div>
            {/* Status */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/30 bg-muted/20 group hover:border-border/60 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Account Status</p>
                <p className="text-xs font-semibold text-emerald-600">Active & Verified</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}