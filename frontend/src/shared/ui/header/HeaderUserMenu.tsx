import * as React from 'react';
import { Button, Card } from '@/shared/ui';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import type { UserRole } from '@/entities/user';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/endpoints/auth.api';

interface HeaderUserMenuProps {
  name: string;
  avatarUrl?: string;
  isLoggedIn?: boolean;
  role?: UserRole;
}

/**
 * User portal for the header. Dynamic state:
 * - Guest: Login / Register CTA
 * - User: Avatar / Dropdown
 */
export function HeaderUserMenu({ name, avatarUrl, isLoggedIn = false, role }: HeaderUserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { logout: clearStore, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed on server, but clearing local session anyway.', error);
    } finally {
      clearStore();
      setIsOpen(false);
      navigate(ROUTES.LOGIN);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link to={ROUTES.LOGIN}>
          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
            Log In
          </Button>
        </Link>
        <Link to={ROUTES.REGISTER}>
          <Button variant="primary" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] px-6 h-10 shadow-lg shadow-primary-100">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  // Fallback for mock/empty user
  const displayName = user?.full_name || name || 'User';
  const displayRole = user?.role || role;

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100 transition-all active:scale-95"
      >
        <div className="h-8 w-8 rounded-full overflow-hidden shadow-sm bg-slate-200 ring-2 ring-white">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-slate-500">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start gap-0.5">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">{displayName}</span>
           <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">
             {displayRole === 'LANDLORD' ? 'Property Owner' : 'Verified Resident'}
           </span>
        </div>
        <svg className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {/* Stylized Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 mt-3 w-60 p-2 border-none shadow-premium rounded-2xl bg-white z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
             <div className="p-3 mb-2 bg-slate-50 rounded-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">Managing Workspace</p>
                <p className="text-xs font-black text-slate-900 leading-tight">Emerald Heights Residence</p>
             </div>
             
              <div className="space-y-1">
                 <Link to={ROUTES.DASHBOARD.MESSAGES} onClick={() => setIsOpen(false)}>
                    <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all flex items-center justify-between">
                       Resident Messages
                       <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                    </button>
                 </Link>
                 <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">Profile Interface</button>
                 <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">Switch Workspace</button>
                 <div className="h-px bg-slate-50 my-1 mx-2" />
                 <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                 >
                   Terminate Session
                 </button>
              </div>
          </Card>
        </>
      )}
    </div>
  );
}
