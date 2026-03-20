import { Link } from 'react-router-dom';

/**
 * Legal and copyright bar for the global footer.
 */
export function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
        <span>© {currentYear} SmartDorm System</span>
        <div className="hidden md:block h-1 w-1 rounded-full bg-slate-200" />
        <div className="flex gap-4 md:gap-6">
          <Link to="#" className="hover:text-slate-900 transition-colors">Accessibility</Link>
          <Link to="#" className="hover:text-slate-900 transition-colors">Sitemap</Link>
        </div>
      </div>

      <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-900">
        <Link to="#" className="hover:text-primary-600 hover:underline transition-all">Terms of Service</Link>
        <Link to="#" className="hover:text-primary-600 hover:underline transition-all">Privacy Policy</Link>
      </div>
    </div>
  );
}
