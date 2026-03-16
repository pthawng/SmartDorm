import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, DoorOpen, Users, CreditCard, Wrench, Settings, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'landlord' | 'tenant';
}

const LANDLORD_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/landlord' },
  { icon: Building2, label: 'Properties', path: '/landlord/properties' },
  { icon: DoorOpen, label: 'Rooms', path: '/landlord/rooms' },
  { icon: Users, label: 'Tenants', path: '/landlord/tenants' },
  { icon: CreditCard, label: 'Payments', path: '/landlord/payments' },
  { icon: Wrench, label: 'Maintenance', path: '/landlord/maintenance' },
  { icon: Settings, label: 'Settings', path: '/landlord/settings' },
];

const TENANT_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/tenant' },
  { icon: CreditCard, label: 'Payments', path: '/tenant/payments' },
  { icon: Wrench, label: 'Maintenance', path: '/tenant/maintenance' },
  { icon: Building2, label: 'Documents', path: '/tenant/documents' },
  { icon: Users, label: 'Messages', path: '/tenant/messages' },
  { icon: Settings, label: 'Settings', path: '/tenant/settings' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = role === 'landlord' ? LANDLORD_NAV : TENANT_NAV;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed inset-y-0 z-40">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
            </div>
            <div>
              <span className="text-lg font-black tracking-tighter text-slate-900 block leading-none">SmartDorm</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {role === 'landlord' ? 'Admin Portal' : 'Tenant Portal'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600' : ''} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black">AH</div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">Alex Henderson</p>
              <p className="text-[11px] font-bold text-slate-400">
                {role === 'landlord' ? 'Premium Landlord' : 'Tenant'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
