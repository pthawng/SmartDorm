/**
 * 404 — Not Found Page.
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">Page not found</p>
      <Link to={ROUTES.HOME} className="text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
