/**
 * Global Error Boundary component.
 * Catches uncaught errors in the React component tree.
 * Uses design system ErrorState component.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './EmptyState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[400px] items-center justify-center p-8">
            <ErrorState
              title="Something went wrong"
              description={this.state.error?.message ?? 'An unexpected error occurred.'}
              onRetry={() => this.setState({ hasError: false, error: null })}
            />
          </div>
        )
      );
    }

    return this.props.children;
  }
}
