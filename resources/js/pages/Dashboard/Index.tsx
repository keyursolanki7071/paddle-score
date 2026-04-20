import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trophy, Users, Calendar, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface DashboardProps {

    stats: {
        activeTournaments: number;
        upcomingMatches: number;
        totalPlayers: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout title="Arena Dashboard">
            <div className="grid gap-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero / Quick Action */}
                <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Zap className="h-24 w-24 text-primary" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-primary text-2xl">Pro-Circuit Active</CardTitle>
                        <p className="text-zinc-400 text-sm">You have 2 finals scheduled for tonight.</p>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="primary">
                            Quick Start Scoring
                        </Button>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-surface-container border-white/5">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Trophy className="h-5 w-5 text-tertiary mb-2" />
                            <div className="text-2xl font-display">{stats.activeTournaments}</div>
                            <div className="text-[10px] uppercase tracking-tighter text-zinc-500">Active Events</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface-container border-white/5">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <Users className="h-5 w-5 text-secondary mb-2" />
                            <div className="text-2xl font-display">{stats.totalPlayers}</div>
                            <div className="text-[10px] uppercase tracking-tighter text-zinc-500">Players Registered</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity List */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm font-display text-zinc-400 uppercase tracking-widest">Upcoming Matches</h2>
                        <Link href={route('tournaments.index')}>
                            <Button variant="ghost" size="sm" className="text-primary h-auto p-0">View All</Button>
                        </Link>
                    </div>
                    
                    {stats.upcomingMatches > 0 ? (
                        [...Array(stats.upcomingMatches)].map((_, i) => (
                            <Link key={i} href={route('tournaments.show', 'm1')} className="block">
                                <Card className="hover:bg-surface-container-highest transition-colors group cursor-pointer active:scale-[0.99] transition-all">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-surface flex items-center justify-center text-[10px]">??</div>
                                                <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-[10px] text-primary font-bold">??</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Pending Matchup</div>
                                                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> To be scheduled
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                            <Calendar className="h-8 w-8 text-zinc-800 mx-auto mb-2 opacity-50" />
                            <p className="text-xs text-zinc-600 uppercase tracking-widest">No Matches Scheduled</p>
                        </div>
                    )}


                </div>
            </div>
        </AppLayout>
    );
}
