import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  children: ReactNode;
}

/**
 * AuthCard — split-layout wrapper with decorative gradient panel + form card.
 * Pure presentational. Used by both Login and Register pages.
 */
export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── Decorative panel ───────────────────────────── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-violet-500 lg:flex lg:items-center lg:justify-center">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-primary-300/10 blur-2xl" />
        </div>

        <div className="relative z-10 max-w-md px-12 text-center text-white">
          <Link to="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-lg font-bold">S</span>
            </div>
            <span className="text-2xl font-bold font-display">SmartDorm</span>
          </Link>
          <h2 className="mt-8 text-3xl font-bold font-display leading-tight">
            Manage your properties with ease
          </h2>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            The all-in-one platform for landlords and tenants. Rooms, contracts, invoices — all in one place.
          </p>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────── */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
