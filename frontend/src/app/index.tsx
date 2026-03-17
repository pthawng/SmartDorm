/**
 * Application entry point.
 * Composes all providers and renders the router.
 */

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/query-provider';
import { AuthProvider } from './providers/auth-provider';
import { ThemeProvider } from './providers/theme-provider';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { Loading } from '@/shared/ui/loading';
import { router } from './router';

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <Suspense fallback={<Loading fullPage message="Loading SmartDorm..." />}>
              <RouterProvider router={router} />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
