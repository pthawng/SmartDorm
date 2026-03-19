import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function SidebarItem({ label, href, icon: Icon, onClick }: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none',
          'hover:bg-slate-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500',
          isActive
            ? 'bg-primary-50 text-primary-600 shadow-sm'
            : 'text-slate-600'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary-600" />
          )}
          <Icon className={cn(
            "h-4.5 w-4.5 shrink-0 transition-colors",
            isActive ? "text-primary-600" : "text-slate-400 group-hover:text-primary-500"
          )} />
          <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">{label}</span>
        </>
      )}
    </NavLink>
  );
}
