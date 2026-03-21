import { useState } from 'react';
import { Loader2, X, LayoutGrid } from 'lucide-react';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderUserMenu } from './HeaderUserMenu';
import { Breadcrumbs } from './Breadcrumbs';
import { LandlordCTA } from './LandlordCTA';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNavigationMenu } from './HeaderNavigationMenu';
import { WorkspaceSwitcher } from '@/features/workspace-management/components/WorkspaceSwitcher';
import type { UserRole } from '@/entities/user';
import { cn } from '@/shared/utils';

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
  const [isSwitching, setIsSwitching] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const isLandlord = userRole === 'LANDLORD' || (isDashboard && isLoggedIn);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Left Section: Menu, Logo & Contextual Nav/Search */}
        <div className="flex items-center gap-6 shrink-0">
          <HeaderLogo />


          {isDashboard ? (
            <div className="hidden xl:block">
              <HeaderSearch />
            </div>
          ) : (
            <nav className="hidden md:block">
              <HeaderNav />
            </nav>
          )}
        </div>

        {/* Center Section: Perfectly Centered Dynamic Breadcrumbs */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block pointer-events-none">
          <div className="pointer-events-auto">
            <Breadcrumbs pageTitle={pageTitle} />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 shrink-0">
          {!isLandlord && (
            <div className="hidden md:block">
              <LandlordCTA />
            </div>
          )}

          {isLandlord && (
            <div className="relative">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all border active:scale-95",
                  isNavOpen
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                    : "text-slate-400 border-transparent hover:border-slate-100 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isNavOpen ? <X className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
              </button>

              {isNavOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-slate-900/5 backdrop-blur-[2px]" onClick={() => setIsNavOpen(false)} />
                  <HeaderNavigationMenu onClose={() => setIsNavOpen(false)} />
                </>
              )}
            </div>
          )}

          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 active:scale-95">
            <div className="relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </div>
          </button>

          <HeaderUserMenu
            name={userName}
            avatarUrl={userAvatar}
            isLoggedIn={isLoggedIn}
            role={isLandlord ? 'LANDLORD' : userRole}
          />
        </div>
      </div>

      {/* Global Loading Overlay for Context Switching */}
      {isSwitching && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-5 p-10 rounded-[2.5rem] bg-white shadow-2xl shadow-indigo-200/40 border border-slate-100/50 scale-110 animate-in zoom-in-95 duration-500 ease-out">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-100/50 rounded-full blur-2xl animate-pulse" />
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Switching Context</h3>
              <p className="text-sm text-slate-500 font-medium max-w-[200px]">We're preparing your workspace details...</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
