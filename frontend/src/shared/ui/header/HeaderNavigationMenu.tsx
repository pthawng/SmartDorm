import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Box, 
  Building2, 
  BedDouble, 
  FileText, 
  Receipt, 
  Wrench, 
  Users, 
  UserCircle, 
  Settings2,
  ChevronRight
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { Card } from '@/shared/ui';

const navGroups = [
  {
    title: 'Main Overview',
    items: [
      { label: 'Overview', href: ROUTES.DASHBOARD.HOME, icon: LayoutDashboard },
      { label: 'Tenant App', href: ROUTES.DASHBOARD.TENANT_HOME, icon: Home },
    ]
  },
  {
    title: 'Administrative',
    items: [
      { label: 'Workspaces', href: ROUTES.DASHBOARD.WORKSPACES, icon: Box },
      { label: 'Manage Properties', href: ROUTES.DASHBOARD.PROPERTIES, icon: Building2 },
      { label: 'Room Inventory', href: ROUTES.DASHBOARD.ROOMS, icon: BedDouble },
    ]
  },
  {
    title: 'Finance & Legal',
    items: [
      { label: 'Contracts', href: ROUTES.DASHBOARD.CONTRACTS, icon: FileText },
      { label: 'Billing & Invoices', href: ROUTES.DASHBOARD.INVOICES, icon: Receipt },
    ]
  },
  {
    title: 'System Operations',
    items: [
      { label: 'Maintenance', href: ROUTES.DASHBOARD.MAINTENANCE, icon: Wrench },
      { label: 'Tenant Directory', href: ROUTES.DASHBOARD.RENTERS, icon: Users },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'My Profile', href: ROUTES.DASHBOARD.SETTINGS_PROFILE, icon: UserCircle },
      { label: 'Team Access', href: ROUTES.DASHBOARD.SETTINGS_TEAM, icon: Settings2 },
    ]
  }
];

interface HeaderNavigationMenuProps {
  onClose: () => void;
}

export function HeaderNavigationMenu({ onClose }: HeaderNavigationMenuProps) {
  return (
    <Card className="absolute right-0 mt-3 w-[min(calc(100vw-2rem),700px)] p-6 border-none shadow-premium rounded-[2rem] bg-white/95 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) => `
                    group flex items-center justify-between p-3 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-xl transition-all duration-300
                      ${'bg-white shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-3'}
                    `}>
                      <item.icon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Decoration */}
      <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
        </div>
        <span className="text-[10px] font-bold text-slate-300 italic">SmartDorm Dashboard v2.0</span>
      </div>
    </Card>
  );
}
