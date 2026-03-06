'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  Search,
  User,
  Calendar,
  Home,
  Building2,
  Info,
  Mail,
  Moon,
  Sun,
  Monitor,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const navLinks = [
  { href: '/', label: 'Home', icon: Home, number: '01' },
  { href: '/museums', label: 'Museums', icon: Building2, number: '02' },
  { href: '/about', label: 'About', icon: Info, number: '03' },
  { href: '/contact', label: 'Contact', icon: Mail, number: '04' },
];

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <style>{`
        .mobile-nav-sheet [data-radix-dialog-content] {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .nav-panel {
          background: #000;
          color: #fff;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 28px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .nav-brand {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
        }

        .nav-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-close-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.4);
        }

        .nav-links-section {
          flex: 1;
          padding: 12px 0;
          overflow-y: auto;
        }

        .nav-link-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
          cursor: pointer;
          background: transparent;
          border-top: none;
          border-right: none;
          border-bottom: none;
          width: 100%;
          text-align: left;
        }

        .nav-link-item:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
          border-left-color: rgba(255,255,255,0.4);
        }

        .nav-link-item.active {
          color: #fff;
          border-left-color: #fff;
          background: rgba(255,255,255,0.07);
        }

        .nav-link-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .nav-link-number {
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
          min-width: 18px;
        }

        .nav-link-item.active .nav-link-number {
          color: rgba(255,255,255,0.6);
        }

        .nav-link-label {
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0.01em;
          line-height: 1;
        }

        .nav-link-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.5);
        }

        .nav-link-item:hover .nav-link-arrow,
        .nav-link-item.active .nav-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .nav-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 8px 28px;
        }

        .nav-section-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          padding: 16px 28px 8px;
        }

        .nav-footer {
          padding: 20px 28px 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .theme-row {
          display: flex;
          gap: 8px;
        }

        .theme-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 6px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 10px;
          letter-spacing: 0.05em;
        }

        .theme-btn:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.05);
        }

        .theme-btn.active {
          color: #000;
          border-color: #fff;
          background: #fff;
        }

        .auth-btn-outline {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px 20px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.25);
          background: transparent;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .auth-btn-outline:hover {
          border-color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.05);
        }

        .auth-btn-solid {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px 20px;
          border-radius: 8px;
          border: 1px solid #fff;
          background: #fff;
          color: #000;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .auth-btn-solid:hover {
          background: rgba(255,255,255,0.88);
          border-color: rgba(255,255,255,0.88);
        }

        .account-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .account-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
      `}</style>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="mobile-nav-sheet p-0 w-[300px] sm:w-[320px] border-none bg-transparent"
          style={{ padding: 0 }}
        >
          <div className="nav-panel">
            {/* Header */}
            <div className="nav-header">
              <span className="nav-brand">{APP_NAME}</span>
              <button className="nav-close-btn" onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="nav-links-section">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`nav-link-item ${pathname === link.href ? 'active' : ''}`}
                >
                  <div className="nav-link-left">
                    <span className="nav-link-number">{link.number}</span>
                    <span className="nav-link-label">{link.label}</span>
                  </div>
                  <ArrowUpRight size={14} className="nav-link-arrow" />
                </Link>
              ))}

              <div className="nav-divider" />

              {/* Search */}
              <Link
                href="/museums?search=true"
                onClick={() => setOpen(false)}
                className="nav-link-item"
              >
                <div className="nav-link-left">
                  <Search size={14} style={{ color: 'rgba(255,255,255,0.4)', minWidth: 18 }} />
                  <span className="nav-link-label" style={{ fontSize: 16 }}>Search</span>
                </div>
                <ArrowUpRight size={14} className="nav-link-arrow" />
              </Link>

              {/* Signed In links */}
              <SignedIn>
                <Link
                  href="/dashboard/bookings"
                  onClick={() => setOpen(false)}
                  className="nav-link-item"
                >
                  <div className="nav-link-left">
                    <Calendar size={14} style={{ color: 'rgba(255,255,255,0.4)', minWidth: 18 }} />
                    <span className="nav-link-label" style={{ fontSize: 16 }}>My Bookings</span>
                  </div>
                  <ArrowUpRight size={14} className="nav-link-arrow" />
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="nav-link-item"
                >
                  <div className="nav-link-left">
                    <User size={14} style={{ color: 'rgba(255,255,255,0.4)', minWidth: 18 }} />
                    <span className="nav-link-label" style={{ fontSize: 16 }}>Profile</span>
                  </div>
                  <ArrowUpRight size={14} className="nav-link-arrow" />
                </Link>
              </SignedIn>
            </div>

            {/* Footer */}
            <div className="nav-footer">
              {/* Theme */}
              <div>
                <p className="nav-section-label">Appearance</p>
                <div className="theme-row">
                  {themeOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`theme-btn ${theme === value ? 'active' : ''}`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth */}
              <SignedOut>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="auth-btn-outline">
                    Sign In
                  </Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)} className="auth-btn-solid">
                    Get Started
                  </Link>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="account-row">
                  <span className="account-label">Account</span>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ elements: { avatarBox: 'h-8 w-8' } }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}