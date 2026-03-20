import { useLocation, Link } from 'react-router-dom';
import { BREADCRUMB_CONFIG } from '@/shared/config/breadcrumbConfig';
import { clsx } from 'clsx';

interface BreadcrumbsProps {
  pageTitle?: string;
  className?: string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Breadcrumbs({ pageTitle, className }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = BREADCRUMB_CONFIG[path] || capitalize(segment.replace(/-/g, ' '));
    const isLast = index === segments.length - 1;

    return { label, path, isLast };
  });

  // Use pageTitle as override for the last item if provided
  if (pageTitle && breadcrumbs.length > 0) {
    const lastItem = breadcrumbs[breadcrumbs.length - 1];
    if (lastItem) {
      lastItem.label = pageTitle;
    }
  }

  return (
    <nav className={clsx("flex items-center gap-2 overflow-hidden whitespace-nowrap", className)}>
      <Link 
        to="/" 
        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-500 transition-colors"
      >
        Portal
      </Link>
      
      {breadcrumbs.map((bc) => (
        <div key={bc.path} className="flex items-center gap-2">
          <span className="text-slate-200 text-[10px] font-black">{">"}</span>
          
          {bc.isLast ? (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 truncate max-w-[150px]">
              {bc.label}
            </span>
          ) : (
            <Link 
              to={bc.path}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[120px]"
            >
              {bc.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
