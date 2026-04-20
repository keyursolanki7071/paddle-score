import * as React from 'react';
import { Button } from './Button';
import { Trash2, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'info';
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-surface rounded-2xl p-8 text-center shadow-2xl border border-white/5 animate-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className={cn(
                        "h-16 w-16 rounded-full flex items-center justify-center",
                        variant === 'danger' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                    )}>
                        {variant === 'danger' ? <Trash2 className="h-8 w-8" /> : <Info className="h-8 w-8" />}
                    </div>
                </div>

                <h2 className="font-display text-2xl uppercase tracking-tight text-white mb-2">
                    {title}
                </h2>
                <p className="text-zinc-400 mb-8 font-sans text-sm leading-relaxed text-pretty">
                    {message}
                </p>

                <div className="flex flex-col gap-3">
                    <Button 
                        variant={variant === 'danger' ? 'primary' : 'secondary'} 
                        className={cn("h-12 text-sm", variant === 'danger' && "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]")}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="h-12 text-sm text-zinc-500"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
