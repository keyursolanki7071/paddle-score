import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePage, router } from '@inertiajs/react';
import { User, Mail, Trophy, Target, TrendingUp, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileProps {
    user: { id: string; name: string; email: string };
    stats: { totalTournaments: number; wins: number; losses: number; winRate: string };
}

export default function Profile({ user, stats }: ProfileProps) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;

    const logout = () => router.post(route('logout'));

    const displayName = user?.name ?? auth?.user?.name ?? 'Athlete';
    const displayEmail = user?.email ?? auth?.user?.email ?? '';

    const initial = displayName.charAt(0).toUpperCase();

    const statItems = [
        { label: 'Tournaments', value: stats.totalTournaments, icon: Trophy, color: 'text-tertiary' },
        { label: 'Wins', value: stats.wins, icon: Shield, color: 'text-primary' },
        { label: 'Losses', value: stats.losses, icon: Target, color: 'text-secondary' },
        { label: 'Win Rate', value: stats.winRate, icon: TrendingUp, color: 'text-yellow-400' },
    ];

    return (
        <AppLayout title="Athlete Profile">
            <div className="animate-in fade-in duration-700">
                {/* Avatar Section */}
                <div className="flex flex-col items-center py-10 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                    <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/30 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(117,255,158,0.2)]">
                        <span className="font-display text-4xl text-black font-bold">{initial}</span>
                    </div>
                    <h2 className="font-display text-2xl uppercase tracking-tight">{displayName}</h2>
                    <div className="flex items-center gap-2 mt-1 text-zinc-500 text-sm">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="font-sans">{displayEmail}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="px-4">
                    <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em] mb-3">Career Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {statItems.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={stat.label}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className={cn('h-4 w-4', stat.color)} />
                                            <span className="text-[10px] font-display uppercase tracking-widest text-zinc-500">{stat.label}</span>
                                        </div>
                                        <div className={cn('text-3xl font-mono font-bold', stat.color)}>{stat.value}</div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Account Info */}
                <div className="p-4 mt-4 space-y-3">
                    <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Account</h3>
                    <Card>
                        <CardContent className="p-0 divide-y divide-white/5">
                            {[
                                { icon: User, label: 'Name', value: displayName },
                                { icon: Mail, label: 'Email', value: displayEmail },
                                { icon: Shield, label: 'Member ID', value: user?.id?.slice(0, 8) + '...' },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.label} className="flex items-center gap-3 p-4">
                                        <Icon className="h-4 w-4 text-zinc-600 shrink-0" />
                                        <div>
                                            <div className="text-[10px] text-zinc-600 uppercase tracking-widest">{item.label}</div>
                                            <div className="text-sm font-sans text-zinc-200">{item.value}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Logout */}
                <div className="p-4">
                    <Button
                        variant="ghost"
                        className="w-full gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
