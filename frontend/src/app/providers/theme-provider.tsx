/**
 * Theme provider placeholder.
 * Can integrate Tailwind dark mode toggle or a custom theme context.
 */

import type { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // TODO: Integrate dark mode toggle via Tailwind's `class` strategy
  return <>{children}</>;
}
