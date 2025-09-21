import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles with perfect alignment
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover-lift transform-gpu leading-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary-dark shadow-glow-primary hover:shadow-lifted',
        secondary:
          'bg-secondary text-white hover:bg-secondary-dark shadow-glow-secondary hover:shadow-lifted',
        outline:
          'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-glow-primary bg-white',
        ghost:
          'text-primary hover:bg-primary-ultra-light hover:text-primary-dark',
        link:
          'text-primary underline-offset-4 hover:underline hover:text-primary-dark p-0 h-auto',
        gradient:
          'gradient-primary text-white hover:shadow-glow-primary shadow-crisp',
        glass:
          'glass-ultra text-gray-900 hover:bg-white/95 shadow-crisp hover:shadow-lifted',
      },
      size: {
        default: 'h-12 px-6 text-sm',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        xl: 'h-16 px-10 text-lg',
        icon: 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={isDisabled}
      data-as-child={asChild ? 'true' : undefined}
        {...props}
      >
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        )}
        {!loading && leftIcon && leftIcon}
        {children && <span>{children}</span>}
        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
