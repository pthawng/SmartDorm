import { cn } from '@/shared/utils/cn';

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <hr className={cn('border-slate-200 border-t w-full', className)} />;
}
