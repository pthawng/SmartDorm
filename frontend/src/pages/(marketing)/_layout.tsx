/**
 * Marketing Layout — public-facing header/footer.
 */

import { Outlet } from 'react-router-dom';

export function MarketingLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white px-6 py-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-xl font-bold text-blue-600">SmartDorm</span>
          {/* TODO: Nav links from features */}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SmartDorm. All rights reserved.
      </footer>
    </div>
  );
}

export default MarketingLayout;
