import React from 'react';

export default function TermsPage() {
  const lastUpdated = "January 27, 2026";

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using MuseMate, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              MuseMate provides a digital platform for booking museum tickets, exploring cultural exhibits, and utilizing AI-driven museum assistance. We act as an intermediary between you and the partnered museums.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials provided via Clerk. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Booking & Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All ticket prices are set by the respective museums.</li>
              <li>Payments are processed securely via our third-party payment gateways.</li>
              <li>Cancellations and refunds are subject to the specific museum's policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>
              MuseMate is not responsible for any injury, loss, or damage occurred during a museum visit. Our liability is limited to the service fee charged by our platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}