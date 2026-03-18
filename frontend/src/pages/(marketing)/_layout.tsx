/**
 * Marketing Layout — public-facing header/footer shell.
 * Uses design system Button. No business logic.
 */

import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold text-slate-900 font-display">SmartDorm</span>
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            <Link to={ROUTES.SEARCH} className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600">
              Browse Rooms
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Main ───────────────────────────────────────── */}
      <main>
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SmartDorm. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="transition-colors hover:text-primary-600">About</a>
            <a href="#" className="transition-colors hover:text-primary-600">Terms</a>
            <a href="#" className="transition-colors hover:text-primary-600">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
