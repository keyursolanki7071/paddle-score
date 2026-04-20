import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Shield, CreditCard, Bell, ChevronRight, LogOut, Settings, Award } from 'lucide-react';

interface ProfileProps {
    user: {
        name: string;
        rank: string;
        matchesPlayed: number;
        winRate: string;
    };
}

export default function ProfileIndex({ user }: ProfileProps) {
    const settingsGroups = [
        {
            title: 'Account',
            items: [
                { name: 'Personal Details', icon: User },
                { name: 'Security & Privacy', icon: Shield },
                { name: 'Push Notifications', icon: Bell },
            ]
        },
        {
            title: 'Tournament Management',
            items: [
                { name: 'Subscription Plan', icon: CreditCard },
                { name: 'Event Certificates', icon: Award },
            ]
        }
    ];

    return (
        <AppLayout title="Athlete Profile">
            <div className="p-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center py-6">
                    <div className="relative mb-4">
                        <div className="h-24 w-24 rounded-full bg-surface-container-highest border-4 border-primary/20 flex items-center justify-center">
                            <span className="text-3xl font-display font-bold text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-zinc-900 border-2 border-background flex items-center justify-center shadow-xl">
                            <Settings className="h-4 w-4 text-zinc-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-display uppercase tracking-tight mb-1">{user.name}</h2>
                    <Badge variant="scheduled" className="bg-tertiary/10 text-tertiary border-tertiary/20">
                        Rank: {user.rank}
                    </Badge>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-surface-container text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-display text-white">{user.matchesPlayed}</div>
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Battles</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface-container text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-display text-white">{user.winRate}</div>
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Win Rate</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings Navigator */}
                <div className="space-y-6">
                    {settingsGroups.map((group) => (
                        <div key={group.title} className="space-y-4">
                            <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em] px-1">{group.title}</h3>
                            <div className="space-y-2">
                                {group.items.map((item) => (
                                    <button 
                                        key={item.name}
                                        className="w-full flex items-center justify-between p-4 bg-surface-container-high rounded-md hover:bg-surface-container-highest transition-colors active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center">
                                                <item.icon className="h-4 w-4 text-zinc-400" />
                                            </div>
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-zinc-700" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Log Out */}
                <Button variant="ghost" className="w-full h-14 gap-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 mt-4">
                    <LogOut className="h-5 w-5" />
                    Sign Out Arena
                </Button>

                <div className="text-center text-[10px] text-zinc-700 font-mono py-8">
                    PADDLE SCORE v1.0.4 r232-stable
                </div>
            </div>
        </AppLayout>
    );
}
