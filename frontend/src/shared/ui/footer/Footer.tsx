import { FooterSection } from './FooterSection';
import { FooterBottom } from './FooterBottom';
import { HeaderLogo } from '../header/HeaderLogo';
import { ROUTES } from '@/shared/config/routes';
import { Facebook, Instagram, Youtube } from 'lucide-react';

/**
 * High-fidelity custom Tiktok icon (fallback for missing lucide member).
 */
const Tiktok = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface FooterProps {
  isDashboard?: boolean;
}

/**
 * Global Footer orchestrator. 
 * Adapts between high-fidelity marketing mode and minimalist dashboard mode.
 */
export function Footer({ isDashboard = false }: FooterProps) {
  // Navigation Definitions
  const footerSections = [
    {
      title: 'Explore',
      links: [
        { label: 'Search Rooms', path: ROUTES.SEARCH },
        { label: 'Properties', path: ROUTES.DASHBOARD.PROPERTIES },
        { label: 'Special Offers', path: ROUTES.SEARCH },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About SmartDorm', path: '#' },
        { label: 'Contact Us', path: '#' },
        { label: 'Careers', path: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '#' },
        { label: 'Terms and Conditions', path: '#' },
        { label: 'Privacy Policy', path: '#' },
      ],
    },
  ];

  if (isDashboard) {
    return (
      <footer className="w-full bg-slate-50/50 border-t border-slate-100 py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <FooterBottom />
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-100 transition-all duration-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 sm:py-20 space-y-16">
        {/* Top Section: Branding & Modular Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-start">
              <HeaderLogo />
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm text-left">
              Elevating the residential experience through high-fidelity digital management. We bridge the gap between properties and people with precision and care.
            </p>
            <div className="flex items-center justify-start gap-3 text-slate-400">
              <div className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all cursor-pointer shadow-sm group">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all cursor-pointer shadow-sm group">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all cursor-pointer shadow-sm group">
                <Youtube className="w-4 h-4" />
              </div>
              <div className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all cursor-pointer shadow-sm group">
                <Tiktok className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Navigation Links Mapping */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-4">
            {footerSections.map((section) => (
              <div key={section.title} className="text-left">
                <FooterSection
                  title={section.title}
                  links={section.links}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Copyright */}
        <FooterBottom />
      </div>
    </footer>
  );
}
