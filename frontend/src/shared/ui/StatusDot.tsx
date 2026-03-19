import { cn } from '@/shared/utils/cn';

interface StatusDotProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
  pulse?: boolean;
}

/**
 * Modern, high-fidelity Status Indicator Dot.
 * Supports pulsing animations for active/urgent states.
 */
export function StatusDot({ status, className, pulse }: StatusDotProps) {
  const statusClasses = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-400',
    error: 'bg-rose-500',
    info: 'bg-primary-500',
    neutral: 'bg-slate-300',
  };

  const glowClasses = {
    success: 'bg-emerald-500/20',
    warning: 'bg-amber-400/20',
    error: 'bg-rose-500/20',
    info: 'bg-primary-500/20',
    neutral: 'bg-slate-300/20',
  };

  return (
    <div className={cn('relative flex items-center justify-center w-3 h-3', className)}>
      {pulse && (
        <span className={cn(
          'absolute inline-flex h-full w-full rounded-full animate-ping opacity-75',
          statusClasses[status]
        )} />
      )}
      <div className={cn(
        'absolute h-full w-full rounded-full blur-[2px]',
        glowClasses[status]
      )} />
      <span className={cn(
        'relative inline-flex rounded-full h-2 w-2 shadow-[0_0_8px_rgba(0,0,0,0.05)] border border-white/20',
        statusClasses[status]
      )} />
    </div>
  );
}
