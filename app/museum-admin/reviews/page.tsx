'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { museumAdminApi } from '@/lib/museum-admin';
import { Museum, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  Star, MessageSquare, Send, ThumbsUp,
  AlertCircle, TrendingUp, CheckCircle2,
  Loader2, Building2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

/* ── Star renderer ── */
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`${sz} ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
      ))}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, sub, color, delay }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-5 overflow-hidden hover:border-border/70 transition-all"
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity ${color}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
          <Icon className="w-4 h-4 text-foreground/70" />
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

const getMuseumName = (m: any) => typeof m === 'object' ? m.title : 'Unknown';
const getAuthorName = (a: any) => typeof a === 'object' ? a.username : 'Anonymous';

export default function ReviewsPage() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [museumFilter, setMuseumFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { filterReviews(); }, [museumFilter, ratingFilter, allReviews]);

  const loadData = async () => {
    try {
      setLoading(true); setError(null);
      const token = await getToken();
      if (!token) { setError('Authentication required'); return; }

      const museumsRes = await museumAdminApi.getMyMuseums(token);
      if (!museumsRes.success || !museumsRes.data) { setError('Failed to load museums'); return; }
      const museumsData = museumsRes.data.data || [];
      setMuseums(museumsData);

      const results = await Promise.all(
        museumsData.map(m => museumAdminApi.getMuseumReviews(m._id, token))
      );
      const all = results.flatMap(r => r.success && r.data ? r.data : []);
      setAllReviews(all); setFilteredReviews(all);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let f = [...allReviews];
    if (museumFilter !== 'all') f = f.filter(r =>
      (typeof r.museum === 'object' ? r.museum._id : r.museum) === museumFilter
    );
    if (ratingFilter !== 'all') f = f.filter(r => r.rating === parseInt(ratingFilter));
    setFilteredReviews(f);
  };

  const handleRespond = async () => {
    if (!selectedReview || !responseText.trim()) { toast.error('Please enter a response'); return; }
    try {
      setResponding(true);
      const token = await getToken();
      if (!token) { toast.error('Authentication required'); return; }
      const res = await museumAdminApi.respondToReview(selectedReview._id, responseText, token);
      if (res.success) {
        toast.success('Response posted!');
        setSelectedReview(null); setResponseText('');
        loadData();
      } else {
        toast.error(res.message || 'Failed to post response');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to post response');
    } finally {
      setResponding(false);
    }
  };

  const stats = {
    total: allReviews.length,
    avg: allReviews.length > 0
      ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : '0.0',
    responded: allReviews.filter(r => r.response).length,
    verified: allReviews.filter(r => r.isVerifiedVisit).length,
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="m-6 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-destructive text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ── Title ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage reviews across all your museums</p>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="Total Reviews"   value={stats.total}     color="bg-violet-500"  delay={0.05} />
        <StatCard icon={Star}          label="Average Rating"  value={`${stats.avg}★`} color="bg-amber-500"   delay={0.10}
          sub="out of 5.0" />
        <StatCard icon={Send}          label="Responded"       value={stats.responded}
          sub={`${stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0}% rate`}
          color="bg-blue-500" delay={0.15} />
        <StatCard icon={CheckCircle2}  label="Verified Visits" value={stats.verified}  color="bg-emerald-500" delay={0.20} />
      </div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm"
      >
        <Select value={museumFilter} onValueChange={setMuseumFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[220px] rounded-xl border-border/50 text-sm">
            <SelectValue placeholder="All Museums" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Museums</SelectItem>
            {museums.map(m => <SelectItem key={m._id} value={m._id}>{m.title}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[160px] rounded-xl border-border/50 text-sm">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5,4,3,2,1].map(n => (
              <SelectItem key={n} value={String(n)}>
                {'★'.repeat(n)}{'☆'.repeat(5-n)} {n} Star{n !== 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="sm:ml-auto text-xs text-muted-foreground self-center">
          {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
        </span>
      </motion.div>

      {/* ── Reviews list ── */}
      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-muted-foreground gap-3 rounded-2xl border border-dashed border-border/50">
          <MessageSquare className="w-8 h-8 opacity-30" />
          <p className="text-sm">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm overflow-hidden hover:border-border/70 transition-all"
            >
              {/* Rating accent bar */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: review.rating >= 4
                    ? 'linear-gradient(90deg, #10b981, transparent)'
                    : review.rating === 3
                    ? 'linear-gradient(90deg, #f59e0b, transparent)'
                    : 'linear-gradient(90deg, #f43f5e, transparent)',
                }}
              />

              <div className="p-5 space-y-4">
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-xl ring-1 ring-border/40">
                      <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-xs font-bold">
                        {getAuthorName(review.author).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold leading-tight">{getAuthorName(review.author)}</p>
                        {review.isVerifiedVisit && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Building2 className="w-3 h-3" />
                          {getMuseumName(review.museum)}
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-[11px] text-muted-foreground">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                </div>

                {/* Content */}
                {review.title && (
                  <p className="font-semibold text-sm">{review.title}</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                {/* Pros & Cons */}
                {((review.pros?.length ?? 0) > 0 || (review.cons?.length ?? 0) > 0) && (
                  <div className="grid grid-cols-2 gap-3">
                    {review.pros && review.pros.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2">Pros</p>
                        <ul className="space-y-1">
                          {review.pros.map((p, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                              <span className="text-emerald-500 mt-0.5">+</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-2">Cons</p>
                        <ul className="space-y-1">
                          {review.cons.map((c, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                              <span className="text-rose-500 mt-0.5">−</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Helpful */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    {review.helpfulCount} found helpful
                  </span>

                  {/* Admin response or respond button */}
                  {review.response ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">
                      ✓ Responded
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                      className="h-7 rounded-xl text-xs gap-1.5 border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      <MessageSquare className="w-3 h-3" /> Respond
                    </Button>
                  )}
                </div>

                {/* Existing response */}
                {review.response && (
                  <div className="ml-4 pl-4 border-l-2 border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Museum Response</span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(review.response.respondedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{review.response.comment}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Response Dialog ── */}
      <Dialog open={!!selectedReview} onOpenChange={() => { setSelectedReview(null); setResponseText(''); }}>
        <DialogContent className="max-w-md rounded-2xl border-border/40 bg-background/90 backdrop-blur-xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base font-bold">Respond to Review</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="p-4 rounded-xl border border-border/30 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{getAuthorName(selectedReview.author)}</p>
                  <Stars rating={selectedReview.rating} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {selectedReview.comment}
                </p>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Your Response
                </label>
                <Textarea
                  placeholder="Thank you for your feedback…"
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  rows={4}
                  className="rounded-xl border-border/50 bg-background/80 text-sm resize-none focus:border-primary/40"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSelectedReview(null); setResponseText(''); }}
                  className="h-9 rounded-xl text-xs border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleRespond}
                  disabled={responding || !responseText.trim()}
                  className="h-9 rounded-xl text-xs gap-1.5"
                >
                  {responding
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Posting…</>
                    : <><Send className="w-3.5 h-3.5" /> Post Response</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}