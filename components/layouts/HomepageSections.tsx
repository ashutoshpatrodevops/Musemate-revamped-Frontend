'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Ticket, Search, Calendar, Shield, ArrowRight, Sparkles,
  MapPin, Clock, Star, Users, Zap, Brain, ChevronRight,
  Building2, Landmark, Globe, CheckCircle2, TrendingUp, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────
   Re-usable animation variants
───────────────────────────────────────────── */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/** Shorthand props for a stagger container */
const stagger = {
  variants: staggerVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true },
};

/** Shorthand props for a fade-up child */
const fadeUp = (delay = 0) => ({
  variants: fadeUpVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true },
  custom: delay,
});

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    desc: 'Our intelligent engine learns your taste — art, history, science — and surfaces exhibitions you will love before you even search.',
    accent: 'from-violet-500/20 to-purple-500/5',
    iconColor: 'text-violet-400',
  },
  {
    icon: Zap,
    title: 'Instant Confirmed Booking',
    desc: 'No waiting, no queues. Select a slot, pay securely, and get an e-ticket in seconds. Works even for group bookings.',
    accent: 'from-amber-500/20 to-orange-500/5',
    iconColor: 'text-amber-400',
  },
  {
    icon: Shield,
    title: 'Secure Payment Gateway',
    desc: 'Bank-grade encryption, UPI, cards, net banking — every transaction is protected. Refunds processed within 48 hours.',
    accent: 'from-emerald-500/20 to-teal-500/5',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Users,
    title: 'Collaborate Program',
    desc: 'Museum owners and curators can onboard, manage listings, track revenue, and engage audiences through our partner dashboard.',
    accent: 'from-sky-500/20 to-blue-500/5',
    iconColor: 'text-sky-400',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    desc: 'See real-time crowd data, pick off-peak slots, set reminders, and manage all your upcoming visits in one calendar view.',
    accent: 'from-rose-500/20 to-pink-500/5',
    iconColor: 'text-rose-400',
  },
  {
    icon: Globe,
    title: 'Pan-India Coverage',
    desc: 'From the National Museum in Delhi to the Chhatrapati Shivaji in Mumbai — 400+ institutions across 28 states, and growing.',
    accent: 'from-indigo-500/20 to-blue-500/5',
    iconColor: 'text-indigo-400',
  },
];

const steps = [
  {
    number: '01',
    title: 'Discover',
    desc: 'Search by city, theme, or let the AI pick the perfect museum for your interests and schedule.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Book',
    desc: 'Choose your date and time slot, select ticket types, and complete the secure checkout in under a minute.',
    icon: Ticket,
  },
  {
    number: '03',
    title: 'Explore',
    desc: 'Arrive with your QR e-ticket, skip the queue, and enjoy a seamless cultural experience.',
    icon: Landmark,
  },
];

const museums = [
  {
    name: 'National Museum',
    city: 'New Delhi',
    category: 'History & Archaeology',
    rating: 4.8,
    visits: '1.2M+',
    tag: 'Top Rated',
    gradient: 'from-amber-900/80 via-stone-900/70 to-transparent',
    bg: 'bg-amber-950',
  },
  {
    name: 'Indian Museum',
    city: 'Kolkata',
    category: 'Art & Natural History',
    rating: 4.7,
    visits: '890K+',
    tag: 'Heritage Site',
    gradient: 'from-teal-900/80 via-stone-900/70 to-transparent',
    bg: 'bg-teal-950',
  },
  {
    name: 'CSMVS',
    city: 'Mumbai',
    category: 'Art & Decorative Arts',
    rating: 4.9,
    visits: '1.5M+',
    tag: 'Most Booked',
    gradient: 'from-indigo-900/80 via-stone-900/70 to-transparent',
    bg: 'bg-indigo-950',
  },
  {
    name: 'Salar Jung Museum',
    city: 'Hyderabad',
    category: 'World Art Collection',
    rating: 4.6,
    visits: '700K+',
    tag: 'AI Pick',
    gradient: 'from-rose-900/80 via-stone-900/70 to-transparent',
    bg: 'bg-rose-950',
  },
];

// const stats = [
//   { value: '400+', label: 'Museums Listed', icon: Building2 },
//   { value: '2M+', label: 'Tickets Booked', icon: Ticket },
//   { value: '28', label: 'States Covered', icon: MapPin },
//   { value: '4.9★', label: 'Average Rating', icon: Star },
// ];

const collaboratorPerks = [
  'Real-time visitor analytics dashboard',
  'AI-driven demand forecasting',
  'Automated payment settlement',
  'Custom promotional campaigns',
  'Multi-event & exhibition management',
  'Priority support & onboarding',
];

/* ─────────────────────────────────────────────
   SECTION COMPONENTS
───────────────────────────────────────────── */

/** 1. Stats Bar */


/** 2. Features Grid */
function FeaturesSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Built for Explorers,{' '}
            <span className="text-primary italic">Curators</span> & Everyone In-Between
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            MuseMate is more than a booking platform — it's a complete cultural ecosystem.
          </p>
        </motion.div>

        <motion.div
          {...stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              {...fadeUp(0.05)}
              className={`relative rounded-2xl border border-border/50 bg-gradient-to-br ${f.accent} p-6 hover:border-border transition-all group overflow-hidden`}
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/3 blur-2xl" />
              <div className={`w-11 h-11 rounded-xl bg-background/60 flex items-center justify-center mb-4 shadow-sm`}>
                <f.icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** 3. How It Works */
function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-20 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            <Zap className="w-3.5 h-3.5" /> Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            From Curious to <span className="text-primary italic">Cultured</span> in 3 Steps
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* connector line */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <motion.div {...stagger} className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                {...fadeUp(i * 0.15)}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative w-[104px] h-[104px] mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                  <div className="relative w-full h-full rounded-full border-2 border-primary/30 bg-background flex items-center justify-center shadow-xl">
                    <step.icon className="w-9 h-9 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shadow">
                    {step.number.slice(1)}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.3)} className="text-center mt-14">
          <Button size="lg" className="rounded-full px-10 h-12 text-base shadow-xl shadow-primary/20" asChild>
            <Link href="/museums">
              Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/** 4. Featured Museums */
function FeaturedMuseumsSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              <Award className="w-3.5 h-3.5" /> Top Destinations
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              India's Most <span className="text-primary italic">Beloved</span> Museums
            </h2>
          </div>
          <Button variant="outline" className="rounded-full self-start md:self-auto" asChild>
            <Link href="/museums">
              View All Museums <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          {...stagger}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {museums.map((m, i) => (
            <motion.div
              key={m.name}
              {...fadeUp(i * 0.1)}
              className="group relative rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all cursor-pointer"
            >
              {/* Placeholder visual */}
              <div className={`w-full h-44 ${m.bg} flex items-center justify-center relative`}>
                <Landmark className="w-16 h-16 text-white/20" />
                <div className={`absolute inset-0 bg-gradient-to-t ${m.gradient}`} />
                {/* tag */}
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                  {m.tag}
                </span>
              </div>
              <div className="p-4 bg-card">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-base leading-tight">{m.name}</h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 ml-2 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" /> {m.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" /> {m.city}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{m.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {m.visits}
                  </span>
                </div>
              </div>
              {/* hover overlay */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** 5. Collaborator CTA Banner */
/** 5. Collaborator CTA Banner */
function CollaboratorSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp()}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16"
          style={{ background: '#0f0a05' }}
        >

          {/* ── Orb layer ── */}

          {/* Giant amber/orange core — top right */}
          <div className="absolute -top-20 -right-20 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #f97316 0%, #ea580c 30%, #9a3412 60%, transparent 80%)',
              filter: 'blur(70px)',
              opacity: 0.8,
            }}
          />

          {/* Warm yellow accent — right edge mid */}
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-[260px] h-[260px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 40%, transparent 75%)',
              filter: 'blur(55px)',
              opacity: 0.55,
            }}
          />

          {/* Deep red depth blob — center right */}
          <div className="absolute -top-10 right-[18%] w-[340px] h-[340px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #dc2626 0%, #991b1b 50%, transparent 80%)',
              filter: 'blur(90px)',
              opacity: 0.45,
            }}
          />

          {/* Subtle ember wash — bottom right */}
          <div className="absolute -bottom-16 right-[25%] w-[280px] h-[180px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)',
              filter: 'blur(65px)',
              opacity: 0.35,
            }}
          />

          {/* Left-side dark mask so text stays readable */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, rgba(15,10,5,0.97) 0%, rgba(15,10,5,0.93) 38%, rgba(15,10,5,0.4) 65%, transparent 100%)',
            }}
          />

          {/* ── Content ── */}
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <motion.div {...fadeUp(0.05)}>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300">
                  <TrendingUp className="w-3.5 h-3.5" /> Collaborate Program
                </span>
              </motion.div>

              <motion.h2
                {...fadeUp(0.1)}
                className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-white leading-[1.05]"
              >
                Are You a{' '}
                <span
                  
                  style={{
                    background: 'linear-gradient(90deg, #fb923c, #f97316, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Museum
                </span>{' '}
                or Curator?
              </motion.h2>

              <motion.p
                {...fadeUp(0.15)}
                className="text-white/55 text-lg leading-relaxed mb-8 max-w-md"
              >
                Join India's fastest-growing cultural platform. List your institution,
                manage bookings, and reach millions of culture lovers — all from one powerful dashboard.
              </motion.p>

              <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="rounded-xl px-8 h-12 text-base font-semibold text-white border-0"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    boxShadow: '0 0 32px rgba(249,115,22,0.55)',
                  }}
                  asChild
                >
                  <Link href="/collaborate">
                    Join the Program <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 h-12 text-base font-semibold text-white/80 hover:text-white hover:bg-white/8 transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.05)' }}
                  asChild
                >
                  <Link href="/collaborate#demo">Request a Demo</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right — perks */}
            <motion.div {...stagger} className="grid grid-cols-1 gap-2.5">
              {collaboratorPerks.map((perk, i) => (
                <motion.div
                  key={perk}
                  {...fadeUp(i * 0.06)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(249,115,22,0.18)',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{
                    borderColor: 'rgba(249,115,22,0.45)',
                    background: 'rgba(249,115,22,0.08)',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(249,115,22,0.2)' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <span className="text-sm font-medium text-white/80">{perk}</span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MASTER EXPORT — drop these sections right
   after your existing <section> in HomePage
───────────────────────────────────────────── */
export function HomePageSections() {
  return (
    <>
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedMuseumsSection />
      <CollaboratorSection />
    </>
  );
}