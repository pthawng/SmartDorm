import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft hover:shadow-premium',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      outline: 'border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-300',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
      link: 'bg-transparent text-primary-500 underline-offset-4 hover:underline p-0 h-auto font-bold',
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs',
      md: 'h-11 px-6 text-sm font-semibold tracking-tight',
      lg: 'h-14 px-8 text-base font-bold tracking-tight',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!isLoading && Icon && iconPosition === 'left' && <Icon className="mr-2 h-4 w-4" />}
        {children}
        {!isLoading && Icon && iconPosition === 'right' && <Icon className="ml-2 h-4 w-4" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
