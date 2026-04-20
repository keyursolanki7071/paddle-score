import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-tighter font-display',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-zinc-800 text-zinc-100',
                live: 'border-transparent bg-primary/20 text-primary animate-pulse',
                scheduled: 'border-transparent bg-tertiary/20 text-tertiary',
                completed: 'border-transparent bg-zinc-700 text-zinc-400',
                outline: 'text-zinc-100 border border-zinc-700',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
