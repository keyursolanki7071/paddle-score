import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { router } from '@inertiajs/react';
import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    data: Record<string, string> | null;
    is_read: boolean;
    created_at: string;
}

interface NotificationsProps {
    notifications: Notification[];
}

const typeColor: Record<string, string> = {
    match_start:    'bg-primary/10 text-primary',
    match_result:   'bg-secondary/10 text-secondary',
    bracket_update: 'bg-tertiary/10 text-tertiary',
};

export default function NotificationsIndex({ notifications }: NotificationsProps) {
    const markRead = (id: string) => router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    const markAll = () => router.patch(route('notifications.read-all'), {}, { preserveScroll: true });

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <AppLayout title="Notifications">
            <div className="animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-zinc-400" />
                        <span className="font-display text-sm uppercase tracking-wide">Alerts</span>
                        {unreadCount > 0 && (
                            <span className="h-5 px-1.5 rounded-full bg-primary text-black text-[10px] font-bold flex items-center">{unreadCount}</span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={markAll}>
                            <CheckCheck className="h-4 w-4" /> Mark All Read
                        </Button>
                    )}
                </div>

                {/* Notifications */}
                <div className="divide-y divide-white/5">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={cn('flex gap-3 p-4 transition-colors', n.is_read ? 'opacity-50' : 'hover:bg-surface-container/50 cursor-pointer')}
                            onClick={() => !n.is_read && markRead(n.id)}
                        >
                            {/* Type Icon */}
                            <div className={cn('h-9 w-9 rounded-full flex items-center justify-center shrink-0', typeColor[n.type] || 'bg-white/5 text-zinc-400')}>
                                <Bell className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-display uppercase tracking-tight leading-tight">{n.title}</h4>
                                    {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1 font-sans leading-relaxed">{n.body}</p>
                                <p className="text-[10px] text-zinc-700 mt-1.5 font-mono">{n.created_at}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {notifications.length === 0 && (
                    <div className="py-20 text-center">
                        <BellOff className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                        <h3 className="font-display uppercase tracking-widest text-zinc-500 mb-2">All Clear</h3>
                        <p className="text-xs text-zinc-700 font-sans">No notifications yet. They'll appear here as matches progress.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
