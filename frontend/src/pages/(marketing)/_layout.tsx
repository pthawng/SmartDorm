/**
 * Marketing Layout — public-facing header/footer shell.
 * Uses design system Button. No business logic.
 */

import { Outlet } from 'react-router-dom';

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Main ───────────────────────────────────────── */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
