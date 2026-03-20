import { cn } from '@/shared/utils/cn';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden h-2", className)}>
      <div 
        className="bg-primary-500 h-full transition-all duration-500 ease-out rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
