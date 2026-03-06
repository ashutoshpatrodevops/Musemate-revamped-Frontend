import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "January 27, 2026";

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with Icon */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective Date: {lastUpdated}</p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-3xl p-6 mb-10 border border-primary/10">
          <p className="text-sm leading-relaxed">
            At MuseMate, your privacy is our priority. This policy explains how we collect, use, and protect your personal information when you use our museum ticket booking platform.
          </p>
        </div>

        <div className="space-y-10 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-primary" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <p><strong>Account Data:</strong> We use Clerk to manage authentication. This includes your name, email address, and profile picture.</p>
              <p><strong>Booking History:</strong> We store details of your museum visits and ticket purchases to provide you with access to your QR codes.</p>
              <p><strong>Usage Data:</strong> We collect anonymous data about how you interact with MuseMate to improve our AI Assistant and user interface.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <EyeOff className="w-5 h-5 mr-2 text-primary" />
              How We Share Information
            </h2>
            <p>
              We do not sell your personal data. We only share information with:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Partner Museums:</strong> To validate your ticket at the entrance.</li>
              <li><strong>Payment Processors:</strong> To handle secure transactions.</li>
              <li><strong>Legal Authorities:</strong> Only when required by Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time via your profile settings or by contacting our support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}