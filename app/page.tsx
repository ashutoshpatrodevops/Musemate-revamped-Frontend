'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, Search, Calendar, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import NotFound from './not-found';
// At the top of your HomePage file
import { CircuitBoard, MousePointerClick, UserCog, Award } from 'lucide-react';
// Add this import at the top
import { HomePageSections } from '@/components/layouts/HomepageSections';
export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  const features = [
  {
    title: "AI-Powered Curator",
    description: "Get personalized exhibition recommendations based on your historical interests and artistic preferences.",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Secure Payments",
    description: "Book tickets instantly with our encrypted payment gateway supporting UPI, Cards, and Net Banking.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Real-time Dashboards",
    description: "Track your bookings, digital tickets, and visit history through an intuitive, sleek dashboard.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Collaborator Program",
    description: "Are you a museum owner? Partner with MuseMate to digitize your ticketing and reach more visitors.",
    icon: <Ticket className="h-6 w-6" />,
  },
  {
    title: "Smart Search",
    description: "Find museums near you or explore by era, style, or popularity with our advanced filtering system.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    title: "Instant Digital Entry",
    description: "No more queues. Simply scan your QR code at the entrance and step right into the gallery.",
    icon: <ArrowRight className="h-6 w-6" />,
  },
];
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>The Future of Cultural Exploration</span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Discover Amazing <br />
              <span className="text-primary italic">Museums</span> Across India
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Skip the lines and dive into history. MuseMate connects you to hundreds of 
              Museums with seamless instant booking.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all" asChild>
                <Link href="/museums">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base backdrop-blur-sm" asChild>
                <Link href="/about">How it works</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
<section className="py-24 bg-secondary/5 relative overflow-hidden">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        Revolutionizing the Museum Experience
      </motion.h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Combining cultural heritage with cutting-edge technology to make every visit unforgettable.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group p-8 rounded-3xl border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
        >
          <div className="mb-6 inline-flex p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
<HomePageSections/>
    </div>
  );
}