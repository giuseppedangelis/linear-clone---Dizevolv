
import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'secondary', size = 'md', isLoading, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:opacity-40 disabled:cursor-not-allowed select-none whitespace-nowrap active:scale-95';
    
    const variants = {
      primary: 'bg-brand-primary hover:brightness-110 active:brightness-90 text-white shadow-sm',
      secondary: 'bg-app-surface hover:bg-app-border-strong active:bg-app-border border border-app-border-strong text-content-primary',
      outline: 'bg-transparent border border-app-border-strong text-content-secondary hover:bg-app-surface hover:text-content-primary',
      ghost: 'bg-transparent hover:bg-app-surface text-content-secondary hover:text-content-primary',
      danger: 'bg-brand-error/10 hover:bg-brand-error/20 text-brand-error border border-brand-error/20 active:bg-brand-error/30',
    };

    const sizes = {
      xs: 'px-1.5 py-0.5 text-[10px]',
      sm: 'px-2.5 py-1.25 text-xs',
      md: 'px-3.5 py-1.75 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };

    return (
      <button 
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
