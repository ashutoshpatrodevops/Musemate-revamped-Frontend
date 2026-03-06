'use client';

import React, { useState } from 'react';
import { HelpCircle, Ticket, CreditCard, User, Plus, Minus, ArrowRight, MessageCircle } from 'lucide-react';

const faqs = [
  {
    category: "Bookings & Tickets",
    icon: Ticket,
    tag: "01",
    questions: [
      {
        q: "How do I receive my tickets?",
        a: "Once your payment is confirmed, your digital ticket will be available instantly in your 'My Bookings' section. We also send a copy to your registered email address."
      },
      {
        q: "Can I cancel or reschedule my visit?",
        a: "Yes, most museums allow cancellations up to 24 hours before the scheduled time. You can manage this directly from your dashboard."
      },
      {
        q: "Do I need to print the ticket?",
        a: "No, MuseMate is 100% paperless. Just show the QR code on your phone at the museum entrance."
      }
    ]
  },
  {
    category: "Payments & Refunds",
    icon: CreditCard,
    tag: "02",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, and popular digital wallets like Google Pay and PhonePe."
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are usually processed within 5-7 business days depending on your bank's policy."
      }
    ]
  },
  {
    category: "Account & Privacy",
    icon: User,
    tag: "03",
    questions: [
      {
        q: "Do I need an account to book?",
        a: "Yes, creating an account helps us keep your tickets secure and allows you to access your booking history anytime."
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We use industry-standard encryption and Clerk for secure authentication to ensure your personal information is always protected."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenItem(prev => prev === key ? null : key);
  };

  return (
    <>
      <style>{`
        .faq-page {
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          padding: 120px 24px 80px;
        }

        .faq-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Hero */
        .faq-hero {
          margin-bottom: 72px;
        }

        .faq-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--foreground);
          color: var(--background);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .faq-title {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--foreground);
          margin: 0 0 20px;
        }

        .faq-title span {
          color: var(--muted-foreground);
        }

        .faq-subtitle {
          font-size: 17px;
          color: var(--muted-foreground);
          line-height: 1.6;
          max-width: 480px;
          margin: 0;
        }

        /* Layout */
        .faq-body {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 640px) {
          .faq-body {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .faq-sidebar {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
        }

        /* Sidebar */
        .faq-sidebar {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .faq-cat-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
        }

        .faq-cat-btn:hover {
          background: var(--accent);
        }

        .faq-cat-btn.active {
          background: var(--foreground);
          color: var(--background);
        }

        .faq-cat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .faq-cat-btn.active .faq-cat-icon {
          background: rgba(255,255,255,0.15);
        }

        .faq-cat-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--foreground);
          transition: color 0.15s;
        }

        .faq-cat-btn.active .faq-cat-name {
          color: var(--background);
        }

        /* Questions */
        .faq-questions {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          background: var(--card);
        }

        .faq-item {
          border-bottom: 1px solid var(--border);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .faq-question-btn:hover {
          background: var(--muted);
        }

        .faq-question-text {
          font-size: 15px;
          font-weight: 500;
          color: var(--foreground);
          line-height: 1.4;
        }

        .faq-toggle-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
          color: var(--muted-foreground);
        }

        .faq-item.open .faq-toggle-icon {
          background: var(--foreground);
          border-color: var(--foreground);
          color: var(--background);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 24px;
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          padding: 0 24px 20px;
        }

        .faq-answer-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--muted-foreground);
          border-left: 2px solid var(--border);
          padding-left: 16px;
        }

        /* CTA */
        .faq-cta {
          margin-top: 48px;
          background: var(--foreground);
          border-radius: 20px;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .faq-cta-left h3 {
          font-size: 22px;
          font-weight: 700;
          color: var(--background);
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }

        .faq-cta-left p {
          font-size: 14px;
          color: color-mix(in srgb, var(--background) 60%, transparent);
          margin: 0;
          line-height: 1.5;
        }

        .faq-cta-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        .cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: var(--background);
          color: var(--foreground);
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          text-decoration: none;
        }

        .cta-btn-primary:hover { opacity: 0.88; }

        .cta-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: color-mix(in srgb, var(--background) 15%, transparent);
          color: color-mix(in srgb, var(--background) 75%, transparent);
          border: 1px solid color-mix(in srgb, var(--background) 20%, transparent);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }

        .cta-btn-ghost:hover {
          background: color-mix(in srgb, var(--background) 20%, transparent);
          color: var(--background);
        }
      `}</style>

      <div className="faq-page">
        <div className="faq-inner">

          {/* Hero */}
          <div className="faq-hero">
            <div className="faq-eyebrow">
              <HelpCircle size={11} />
              Help Center
            </div>
            <h1 className="faq-title">
              Frequently asked<br />
              <span>questions</span>
            </h1>
            <p className="faq-subtitle">
              Everything you need to know about MuseMate and your museum experience. Can't find an answer? Talk to our team.
            </p>
          </div>

          {/* Body */}
          <div className="faq-body">

            {/* Sidebar */}
            <div className="faq-sidebar">
              {faqs.map((section, idx) => (
                <button
                  key={idx}
                  className={`faq-cat-btn ${activeCategory === idx ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(idx); setOpenItem(null); }}
                >
                  <div className="faq-cat-icon">
                    <section.icon size={14} color={activeCategory === idx ? '#fff' : '#444'} />
                  </div>
                  <span className="faq-cat-name">{section.category}</span>
                </button>
              ))}
            </div>

            {/* Questions */}
            <div>
              <div className="faq-questions">
                {faqs[activeCategory].questions.map((faq, fIdx) => {
                  const key = `${activeCategory}-${fIdx}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button className="faq-question-btn" onClick={() => toggle(key)}>
                        <span className="faq-question-text">{faq.q}</span>
                        <span className="faq-toggle-icon">
                          {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                        </span>
                      </button>
                      <div className="faq-answer">
                        <p className="faq-answer-text">{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="faq-cta">
            <div className="faq-cta-left">
              <h3>Still have questions?</h3>
              <p>Our support team typically replies within a few hours.</p>
            </div>
            <div className="faq-cta-actions">
              <a href="/contact" className="cta-btn-primary">
                <MessageCircle size={14} />
                Contact Support
              </a>
              <a href="#" className="cta-btn-ghost">
                Talk to Assistant
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}