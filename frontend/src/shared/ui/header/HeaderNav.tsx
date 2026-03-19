import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

/**
 * Navigation links for the marketing and public pages.
 */
export function HeaderNav() {
  const navItems = [
    { label: 'Browse Rooms', path: ROUTES.SEARCH },
  ];

  return (
    <nav className="flex items-center gap-8">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }: { isActive: boolean }) =>
            `text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-slate-400'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
