import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderUserMenu } from './HeaderUserMenu';
import type { UserRole } from '@/entities/user';

interface HeaderProps {
  isDashboard?: boolean;
  isLoggedIn?: boolean;
  pageTitle?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: UserRole;
}

/**
 * Main Global Header orchestrator.
 */
export function Header({ 
  isDashboard = false, 
  isLoggedIn = false,
  pageTitle,
  userName = 'Alex Rivers',
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  userRole
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Left Section */}
        <div className="flex items-center gap-12">
          <HeaderLogo />
          {!isDashboard && (
            <div className="hidden md:block">
              <HeaderNav />
            </div>
          )}
        </div>

        {/* Center Section (Dashboard Breadcrumbs / Search Placeholder) */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          {isDashboard ? (
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Dashboard</span>
               <span className="h-1 w-1 rounded-full bg-slate-200" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">{pageTitle || 'Home'}</span>
            </div>
          ) : (
            <div className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-full h-11 px-6 flex items-center gap-3 text-slate-400 group hover:border-slate-200 transition-all cursor-pointer">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-600 transition-colors">Global Search Interface</span>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 active:scale-95">
             <div className="relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
             </div>
          </button>
          
          <HeaderUserMenu 
            name={userName} 
            avatarUrl={userAvatar} 
            isLoggedIn={isLoggedIn} 
            role={userRole} 
          />
        </div>
      </div>
    </header>
  );
}
