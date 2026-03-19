import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

/**
 * High-fidelity brand identity component for the SmartDorm header.
 */
export function HeaderLogo() {
  return (
    <Link to={ROUTES.HOME} className="flex items-center gap-2 group cursor-pointer select-none no-underline">
      <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
        <svg 
          className="w-5 h-5 text-white" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-lg font-black tracking-tighter text-slate-900">
        Smart<span className="text-primary-600">Dorm</span>
      </span>
    </Link>
  );
}
