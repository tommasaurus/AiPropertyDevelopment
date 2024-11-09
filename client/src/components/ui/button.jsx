// src/components/ui/button.jsx
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';
import './UI.css';

const Button = React.forwardRef(
  (
    { className, variant = 'default', size = 'default', asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <div className="calendar">
        <Comp
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            variant === 'default' &&
              'bg-primary text-primary-foreground hover:bg-primary/90',
            variant === 'destructive' &&
              'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            variant === 'outline' &&
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            variant === 'secondary' &&
              'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
            variant === 'link' && 'hover:bg-accent hover:text-accent-foreground',
            size === 'default' && 'h-10 px-4 py-2',
            size === 'sm' && 'h-9 rounded-md px-3',
            size === 'lg' && 'h-11 rounded-md px-8',
            size === 'icon' && 'h-9 w-9',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Button.displayName = 'Button';

export { Button };
