import { FooterSection } from './FooterSection';
import { FooterBottom } from './FooterBottom';
import { HeaderLogo } from '../header/HeaderLogo';
import { ROUTES } from '@/shared/config/routes';

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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 sm:py-32 space-y-24">
        {/* Top Section: Branding & Modular Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-20 lg:gap-12">
          {/* Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-10">
            <div className="flex justify-center sm:justify-start">
               <HeaderLogo />
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm mx-auto sm:mx-0 text-center sm:text-left">
              Elevating the residential experience through high-fidelity digital management. We bridge the gap between properties and people.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-slate-400">
               {/* Placeholders for Social Icons */}
               <div className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm"><span className="text-[10px] font-black uppercase">Fb</span></div>
               <div className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm"><span className="text-[10px] font-black uppercase">Ig</span></div>
               <div className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm"><span className="text-[10px] font-black uppercase">Li</span></div>
            </div>
          </div>

          {/* Navigation Links Mapping */}
          {footerSections.map((section) => (
            <div key={section.title} className="text-center sm:text-left">
              <FooterSection 
                title={section.title} 
                links={section.links} 
              />
            </div>
          ))}
        </div>

        {/* Legal & Copyright */}
        <FooterBottom />
      </div>
    </footer>
  );
}
