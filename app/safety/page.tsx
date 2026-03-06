import React from 'react';
import { ShieldCheck, Users, Eye, Lock, Map, AlertCircle, HeartPulse } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const measures = [
  {
    title: "Crowd Management",
    desc: "We use Digital Twin technology to monitor museum floor density in real-time, ensuring you never feel overcrowded.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    title: "Secure Ticketing",
    desc: "Every ticket is encrypted with a unique, time-sensitive QR code to prevent duplication and unauthorized entry.",
    icon: Lock,
    color: "bg-green-500/10 text-green-600"
  },
  {
    title: "Smart Navigation",
    desc: "Our interactive maps guide you through the safest and quickest routes, including emergency exit awareness.",
    icon: Map,
    color: "bg-orange-500/10 text-orange-600"
  },
  {
    title: "Verified Museums",
    desc: "We only partner with museums that adhere to strict national safety and preservation standards.",
    icon: ShieldCheck,
    color: "bg-purple-500/10 text-purple-600"
  }
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your Safety is our <span className="text-primary">Masterpiece</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            At MuseMate, we blend advanced technology with rigorous physical protocols to ensure your cultural exploration is secure, seamless, and stress-free.
          </p>
        </div>

        {/* Digital Safety Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {measures.map((m, i) => (
            <Card key={i} className="border-none bg-secondary/30 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-start space-x-5">
                <div className={`p-3 rounded-2xl ${m.color} shrink-0`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health & Protocol Section */}
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-12 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold uppercase tracking-wider">
                <HeartPulse className="w-3 h-3 mr-2" />
                Visitor Well-being
              </div>
              <h2 className="text-3xl font-bold">On-Site Security Protocols</h2>
              <p className="text-muted-foreground">
                In addition to our digital safeguards, we work closely with museum staff to ensure:
              </p>
              <ul className="space-y-3">
                {[
                  "Mandatory security screening at all entry points.",
                  "24/7 CCTV surveillance linked to digital twins.",
                  "Trained medical first-responders on standby.",
                  "Automated emergency broadcast systems via the MuseMate app."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mr-3 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 bg-card rounded-2xl p-6 shadow-xl border relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4">
                  <Eye className="w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
               </div>
               <h4 className="font-bold mb-4">Digital Twin Integration</h4>
               <p className="text-xs text-muted-foreground mb-4">
                 Our system creates a virtual replica of the museum floor to simulate crowd flow and identify potential safety bottlenecks before they happen.
               </p>
               <div className="h-32 bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed">
                 <span className="text-xs font-mono text-muted-foreground">Active Safety Simulation System</span>
               </div>
            </div>
          </div>
        </div>

        {/* Reporting CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Notice a safety concern? <a href="/contact" className="text-primary font-semibold underline underline-offset-4">Report it immediately</a> to our 24/7 Security Operations Center.
          </p>
        </div>
      </div>
    </div>
  );
}