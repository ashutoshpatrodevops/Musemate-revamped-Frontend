'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Info, Target, Users, Sparkles, MapPin, Compass,
  ArrowRight, Brain, Shield, Ticket, Star, Heart,
  Lightbulb, Globe, CheckCircle2, Quote, ChevronRight,
  Building2, Zap, Award, TrendingUp
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

/* ─────────────────────────────────────────
   Animation Variants
───────────────────────────────────────── */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = (delay = 0) => ({
  variants: fadeUpVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true },
  custom: delay,
});

const stagger = {
  variants: staggerVariants,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true },
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */


const values = [
  {
    icon: Heart,
    title: 'Culture First',
    desc: 'Every decision we make is rooted in our love for art, history, and the stories artifacts carry across generations.',
    gradient: 'from-rose-500/15 to-pink-500/5',
    iconColor: 'text-rose-400',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Always',
    desc: 'We combine AI, real-time data, and elegant design to push what a museum experience can be in the digital age.',
    gradient: 'from-amber-500/15 to-yellow-500/5',
    iconColor: 'text-amber-400',
  },
  {
    icon: Globe,
    title: 'Access for All',
    desc: 'Cultural heritage belongs to everyone. We build products that are inclusive, affordable, and available across India.',
    gradient: 'from-sky-500/15 to-blue-500/5',
    iconColor: 'text-sky-400',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    desc: 'Bank-grade encryption, transparent pricing, and instant refunds. We protect every visitor and every partner.',
    gradient: 'from-emerald-500/15 to-teal-500/5',
    iconColor: 'text-emerald-400',
  },
];

const timeline = [
  {
    year: '2024 September',
    title: 'The Idea',
    desc: 'Founded in Odisha by a team of museum lovers and developers frustrated by paper queues and outdated ticketing systems.',
  },
  {
    year: '2024 December',
    title: 'Developing The Ecosystem',
    desc: 'Developed the Platform with lots of enthusiasm.',
  },
  {
    year: '2025 March',
    title: 'AI Curator Launch',
    desc: 'Research made on  AI-powered recommendations and virtual guides.',
  },
  {
    year: '2026 May',
    title: 'Launch & Pan-India Expansion',
    desc: 'Collaboaret program expasion and partership with Ministry of tourism',
  },
];

const team = [
  {
    name: 'Ashutosh Patro',
    role: 'Developement & Operations Lead',
    photo: '/team/me.jpg',
    bg: 'bg-amber-950',
    initials: 'AP',
    quote: 'Building Systems for Mankind',
  },
  {
    name: 'Pidugu Sai Naresh',
    role: 'UI & Product Management Lead',
    photo: '/team/sai.jpeg',
    bg: 'bg-sky-950',
    initials: 'PS',
    quote: 'Technology should feel invisible — just magic',
  },
  {
    name: 'Ankit Kumar Tripathy',
    role: 'Research & Developement Lead',
    photo: '/team/ankit.jpeg',
    bg: 'bg-emerald-950',
    initials: 'AP',
    quote: 'We grow only when our museum partners grow.',
  },
  {
    name: 'Soumitra Ghosh',
    role: 'ML & GenAI infrastructure LEad',
    photo: '/team/soumitra2.jpeg',
    bg: 'bg-violet-950',
    initials: 'AI',
    quote: 'i code with vibe',
  },
];

const testimonials = [
  {
    quote: 'MuseMate transformed how we manage footfall. Our digital bookings went up 300% in 3 months.',
    author: 'Dr. Kavitha Nair',
    role: 'Director, Government Museum Chennai',
    rating: 5,
  },
  {
    quote: 'I visited 12 museums across Rajasthan on one trip — all booked through MuseMate. Flawless.',
    author: 'Sameer Gupta',
    role: 'Travel Blogger, Explorer\'s Diary',
    rating: 5,
  },
  {
    quote: 'The AI recommended an exhibit I had no idea existed. Best surprise of my year.',
    author: 'Meera Pillai',
    role: 'Art Enthusiast, Kochi',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Is MuseMate free for visitors?',
    a: 'Yes! Browsing and discovering museums is completely free. You only pay for the museum ticket itself — no hidden platform fees.',
  },
  {
    q: 'How does the AI curator work?',
    a: 'Our AI analyses your past visits, saved museums, and stated preferences to surface exhibitions and events tailored specifically to you.',
  },
  {
    q: 'Can I get a refund if I cancel?',
    a: 'Absolutely. Cancellations made 24 hours before your visit are fully refunded. Refunds are processed within 48 hours to your original payment method.',
  },
  {
    q: 'How can my museum join MuseMate?',
    a: 'Visit our Collaborate page, fill out the onboarding form, and our team will reach out within 2 business days to get you set up.',
  },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[5%] left-[10%] w-96 h-96 bg-primary/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-[5%] right-[10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" />
          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 text-center max-w-5xl">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              India's Cultural Discovery Platform
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8"
          >
            Making Culture{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Accessible
            </span>{' '}
            <br className="hidden md:block" />
            to Every Indian
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {APP_NAME} was born from a simple belief — that India's extraordinary cultural 
            heritage deserves a world-class digital gateway. We're building it, one museum at a time.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-xl shadow-primary/20" asChild>
              <Link href="/museums">Start Exploring <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base" asChild>
              <Link href="/collaborate">Partner With Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── STATS GRID ───────────────────────── */}
      

      {/* ── MISSION & VISION ─────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              <Target className="w-3.5 h-3.5" /> Our Purpose
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Why We Exist
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <motion.div
              {...fadeUp(0.1)}
              className="relative p-10 rounded-3xl border border-border/60 bg-gradient-to-br from-primary/8 to-transparent overflow-hidden group hover:border-primary/40 transition-all"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To democratize art and history by providing seamless booking, interactive AI assistance,
                and immersive digital experiences that turn a simple museum visit into a lifelong memory.
              </p>
              <ul className="mt-6 space-y-2">
                {['Zero-queue entry for every visitor', 'AI that feels like a personal curator', 'Revenue growth for every museum partner'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              {...fadeUp(0.2)}
              className="relative p-10 rounded-3xl border border-border/60 bg-gradient-to-br from-blue-500/8 to-transparent overflow-hidden group hover:border-blue-500/40 transition-all"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px]" />
              <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-6">
                <Compass className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                A world where curiosity has no barriers. We aim to be the global standard for
                discovering India's cultural heritage through the lens of modern innovation — and eventually, the world's.
              </p>
              <ul className="mt-6 space-y-2">
                {['1000+ museums by 2026', 'Regional language support', 'AR/VR gallery experiences'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────── */}
      <section className="py-20 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              <Heart className="w-3.5 h-3.5" /> What We Stand For
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Our Core Values
            </h2>
          </motion.div>

          <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <motion.div
                key={v.title}
                {...fadeUp(0.05)}
                className={`relative rounded-2xl border border-border/50 bg-gradient-to-br ${v.gradient} p-7 hover:border-border transition-all group overflow-hidden`}
              >
                <div className="w-11 h-11 rounded-xl bg-background/60 flex items-center justify-center mb-4 shadow-sm">
                  <v.icon className={`w-5 h-5 ${v.iconColor}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              <TrendingUp className="w-3.5 h-3.5" /> Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              From Idea to Impact
            </h2>
          </motion.div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-border/60 -translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  {...fadeUp(i * 0.1)}
                  className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                >
                  {/* dot */}
                  <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/30 z-10" />

                  {/* year pill — desktop */}
                  <div className={`hidden md:flex w-1/2 ${i % 2 === 0 ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
                    <span className="text-5xl font-black text-primary/20 tracking-tighter">{item.year}</span>
                  </div>

                  {/* card */}
                  <div className={`ml-14 md:ml-0 w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                    <div className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all">
                      <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block md:hidden">{item.year}</span>
                      <h3 className="font-extrabold text-xl mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────── */}
      <section className="py-24 bg-background">
  <div className="container mx-auto px-4 max-w-6xl">
    {/* Header Section */}
    <motion.div {...fadeUp()} className="mb-20">
      <div className="flex items-center gap-4 mb-7">
        <div className="h-px w-12 bg-primary/60" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
          The Core Team
        </span>
      </div>
      <h2 className="text-4xl md:text-6xl font-black leading-[1.15] pb-1"
  style={{
    background: "linear-gradient(135deg, #f97316, #ec4899, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }}
>
  Building the future of <span className="italic">Culture.</span>
</h2>
    </motion.div>

    {/* Team Grid */}
    <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-19">
      {team.map((member, index) => (
        <motion.div
          key={member.name}
          {...fadeUp(index * 0.1)}
          className="group flex flex-col"
        >
          {/* Shorter Photo Container */}
          <div className="relative h-72 mb-6 overflow-hidden rounded-2xl bg-muted transition-all duration-500 ring-1 ring-border group-hover:ring-primary/40">
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-cover  group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
              loading="lazy"
            />
            {/* Subtle Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Initials Badge */}
            
          </div>

          {/* Info Below Photo */}
          <div className="space-y-2 px-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {member.name}
            </h3>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">
              {member.role}
            </p>
            
            <div className="pt-4 mt-4 border-t border-border/50">
              <div className="flex gap-3">
                <Quote className="w-4 h-4 text-primary shrink-0 opacity-40" />
                <p className="text-sm text-muted-foreground italic leading-snug">
                  {member.quote}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
      {/* ── TESTIMONIALS ─────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              <Star className="w-3.5 h-3.5" /> What People Say
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Loved by Explorers & <span className="text-primary italic">Museums</span> Alike
            </h2>
          </motion.div>

          <motion.div {...stagger} className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                {...fadeUp(i * 0.1)}
                className="relative p-8 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all group"
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="border-t border-border/40 pt-4">
                  <p className="font-bold text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section className="py-20 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              <Info className="w-3.5 h-3.5" /> Common Questions
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Frequently Asked
            </h2>
          </motion.div>

          <motion.div {...stagger} className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                {...fadeUp(i * 0.08)}
                className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────── */}
      {/* ── FINAL CTA ────────────────────────── */}
<section className="py-20">
  <div className="container mx-auto px-4 max-w-6xl">
    <motion.div
      {...fadeUp()}
      className="relative rounded-3xl overflow-hidden"
      style={{ background: '#0a0f1e' }}
    >
      {/* ── Vibrant orb layer (mimics the reference image) ── */}

      {/* Large electric-blue orb — top right */}
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #2563eb 0%, #1d4ed8 30%, #1e3a8a 60%, transparent 80%)',
          filter: 'blur(60px)',
          opacity: 0.85,
        }}
      />

      {/* Cyan accent — right edge */}
      <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-[280px] h-[280px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, #0284c7 40%, transparent 75%)',
          filter: 'blur(50px)',
          opacity: 0.6,
        }}
      />

      {/* Indigo depth blob — center right */}
      <div className="absolute top-0 right-[15%] w-[360px] h-[360px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #4f46e5 0%, #3730a3 50%, transparent 80%)',
          filter: 'blur(80px)',
          opacity: 0.5,
        }}
      />

      {/* Subtle sapphire wash — bottom */}
      <div className="absolute -bottom-20 right-[30%] w-[300px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
          filter: 'blur(70px)',
          opacity: 0.35,
        }}
      />

      {/* Very faint dark-blue left side to keep text readable */}
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, rgba(10,15,30,0.97) 0%, rgba(10,15,30,0.92) 40%, rgba(10,15,30,0.3) 70%, transparent 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-12 md:p-20 max-w-2xl">
        <motion.div {...fadeUp(0.05)}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm font-medium text-white/80 mb-7">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            India's #1 Museum Booking Platform
          </div>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-6"
        >
          Ready to Explore{' '}
          <br />
          <span
            
            style={{
              background: 'linear-gradient(90deg, #60a5fa, #818cf8, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            India's Stories?
          </span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.15)}
          className="text-lg text-white/60 max-w-lg leading-relaxed mb-10"
        >
          Thousands of museums, millions of artifacts, and one seamless platform.
          Your next unforgettable experience is one click away.
        </motion.p>

        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Primary — solid electric blue like the reference */}
          <Button
            size="lg"
            className="rounded-xl px-7 h-12 text-base font-semibold text-white border-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              boxShadow: '0 0 30px rgba(37,99,235,0.5)',
            }}
            asChild
          >
            <Link href="/museums">
              Discover Museums <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {/* Secondary — ghost with white border */}
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-7 h-12 text-base font-semibold border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
            asChild
          >
            <Link href="/collaborate">Join as a Partner</Link>
          </Button>
        </motion.div>
      </div>

    </motion.div>
  </div>
</section>
    </div>
  );
}