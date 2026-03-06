import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Have questions about museum bookings or technical issues? Our team is here to help you navigate your cultural journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none bg-secondary/50 rounded-3xl">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <p className="text-sm text-muted-foreground">support@musemate.in</p>
                    <p className="text-sm text-muted-foreground">partners@musemate.in</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Call Us</h3>
                    <p className="text-sm text-muted-foreground">+91 (800) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Mon - Fri, 9am - 6pm IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">
                      Innovation Hub, Sector 5<br />
                      Bhubaneswar, Odisha, India
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Support Card */}
            <div className="p-8 rounded-3xl bg-primary text-primary-foreground">
              <MessageSquare className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Live Support</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Chat with our AI Assistant for instant answers regarding ticket cancellations or museum timings.
              </p>
              <Button variant="secondary" className="w-full rounded-full font-semibold">
                Open Assistant
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">First Name</label>
                  <Input placeholder="John" className="rounded-2xl h-12 bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Last Name</label>
                  <Input placeholder="Doe" className="rounded-2xl h-12 bg-card" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email Address</label>
                <Input type="email" placeholder="john@example.com" className="rounded-2xl h-12 bg-card" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Subject</label>
                <Input placeholder="How can we help?" className="rounded-2xl h-12 bg-card" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Message</label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-[150px] rounded-3xl bg-card p-4"
                />
              </div>

              <Button size="lg" className="w-full md:w-auto px-12 rounded-full h-12 group transition-all">
                Send Message
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}