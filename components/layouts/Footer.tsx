import Link from 'next/link';
import { Lobster_Two } from 'next/font/google';
import { APP_NAME, SOCIAL_LINKS, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants';
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press Kit', href: '/press' },
  ],
  explore: [
    { label: 'Museums', href: '/museums' },
    { label: 'Special Exhibitions', href: '/museums?featured=true' },
    { label: 'Virtual Tours', href: '/virtual-tours' },
    { label: 'Gift Cards', href: '/gift-cards' },
  ],
  support: [
    { label: 'Help Center', href: '/faq' },
    { label: 'Safety Measures', href: '/safety' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
            <Image
                        src="/finallogo.png"
                        alt={`${APP_NAME} logo`}
                        width={50}
                        height={50}
                        className="h-12 w-12 object-contain"
                        priority
                      />
              <span className={`${lobsterTwo.className} text-3xl tracking-tight`}>
                {APP_NAME}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Connecting culture enthusiasts with India's most iconic heritage sites. 
              Our mission is to make art and history accessible to everyone, everywhere.
            </p>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Subscribe to our newsletter
              </h4>
              <div className="flex max-w-sm items-center space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-full bg-muted/50 border-none focus-visible:ring-1" 
                />
                <Button size="icon" className="rounded-full shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Explore</h3>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-semibold text-foreground">Get in touch</h3>
            <div className="space-y-3 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>Email Us</span>
              </a>
              <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>Call Center</span>
              </a>
            </div>
            <div className="flex gap-4">
              <Link href={SOCIAL_LINKS.facebook} className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href={SOCIAL_LINKS.instagram} className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href={SOCIAL_LINKS.twitter} className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {APP_NAME} Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}