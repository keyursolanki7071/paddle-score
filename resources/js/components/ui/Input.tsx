import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    sport?: 'pickleball' | 'padel' | 'velocity';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, sport = 'pickleball', ...props }, ref) => {
        const glowColor = {
            pickleball: 'focus:border-primary',
            padel: 'focus:border-secondary',
            velocity: 'focus:border-tertiary',
        }[sport];

        return (
            <input
                type={type}
                className={cn(
                    'flex h-10 w-full rounded-md border border-white/10 bg-surface-container-highest px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus:border-b-2 transition-all disabled:cursor-not-allowed disabled:opacity-50 font-sans',
                    glowColor,
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
