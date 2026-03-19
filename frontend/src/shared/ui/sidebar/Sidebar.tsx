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
  Settings2 
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 overflow-y-auto overflow-x-hidden scrollbar-hide select-none transition-all duration-300">
      {/* Brand Header */}
      <div className="p-6 h-20 flex items-center border-b border-slate-50/80 bg-gradient-to-br from-white to-slate-50/20">
        <h1 className="text-xl font-display font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-base">S</span>
          </div>
          <span className="tracking-tight uppercase font-black text-lg">Smart<span className="text-primary-600">Dorm</span></span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <SidebarSection title="Main Overview">
          <SidebarItem label="Overview" href={ROUTES.DASHBOARD.HOME} icon={LayoutDashboard} />
          <SidebarItem label="Tenant App" href={ROUTES.DASHBOARD.TENANT_HOME} icon={Home} />
        </SidebarSection>

        <SidebarSection title="Administrative">
          <SidebarItem label="Workspaces" href={ROUTES.DASHBOARD.WORKSPACES} icon={Box} />
          <SidebarItem label="Manage Properties" href={ROUTES.DASHBOARD.PROPERTIES} icon={Building2} />
          <SidebarItem label="Room Inventory" href={ROUTES.DASHBOARD.ROOMS} icon={BedDouble} />
        </SidebarSection>

        <SidebarSection title="Finance & Legal">
          <SidebarItem label="Contracts" href={ROUTES.DASHBOARD.CONTRACTS} icon={FileText} />
          <SidebarItem label="Billing & Invoices" href={ROUTES.DASHBOARD.INVOICES} icon={Receipt} />
        </SidebarSection>

        <SidebarSection title="System Operations">
          <SidebarItem label="Maintenance" href={ROUTES.DASHBOARD.MAINTENANCE} icon={Wrench} />
          <SidebarItem label="Tenant Directory" href={ROUTES.DASHBOARD.RENTERS} icon={Users} />
        </SidebarSection>

        <SidebarSection title="System Settings">
          <SidebarItem label="My Profile" href={ROUTES.DASHBOARD.SETTINGS_PROFILE} icon={UserCircle} />
          <SidebarItem label="Team Access" href={ROUTES.DASHBOARD.SETTINGS_TEAM} icon={Settings2} />
        </SidebarSection>
      </nav>

      {/* User Footer */}
      <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-100">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCircle className="text-slate-400 w-6 h-6" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate">Admin User</span>
            <span className="text-[10px] text-slate-500 font-medium truncate italic">Master Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
