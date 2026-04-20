import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display uppercase tracking-wider',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(117,255,158,0.2)]',
                secondary: 'bg-secondary text-black hover:bg-secondary/90 shadow-[0_0_15px_rgba(255,181,157,0.2)]',
                tertiary: 'bg-tertiary text-black hover:bg-tertiary/90',
                outline: 'border border-outline-variant bg-transparent hover:bg-surface-container-high text-zinc-100',
                ghost: 'hover:bg-surface-container-high text-zinc-100',
                sport: 'bg-surface-container-highest text-primary border-b-2 border-primary',
                white: 'bg-zinc-100 text-black hover:bg-zinc-200',
            },

            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 px-3 text-xs',
                lg: 'h-11 px-8 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
