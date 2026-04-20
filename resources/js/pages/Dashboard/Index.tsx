import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, Zap, Lightning, Users, Activity, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpcomingMatch {
    id: string;
    team_a: string;
    team_b: string;
    tournament: string;
    scheduled_at: string | null;
    sport: string;
}

interface DashboardProps {
    activeTournaments: number;
    liveMatches: number;
    totalPlayers: number;
    upcomingMatches: UpcomingMatch[];
}

export default function Dashboard({ activeTournaments, liveMatches, totalPlayers, upcomingMatches }: DashboardProps) {
    const isArenaActive = liveMatches > 0;

    return (
        <AppLayout title="Arena Dashboard">
            <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface-container to-background p-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            {isArenaActive ? (
                                <Badge variant="live" className="animate-pulse">● {liveMatches} Live</Badge>
                            ) : (
                                <Badge variant="scheduled">Ready</Badge>
                            )}
                        </div>
                        <h2 className="font-display text-3xl uppercase tracking-tight mb-1">
                            {isArenaActive ? 'Matches Running' : activeTournaments > 0 ? 'Arena Active' : 'Welcome Back'}
                        </h2>
                        <p className="text-zinc-400 text-sm font-sans">
                            {activeTournaments > 0
                                ? `${activeTournaments} tournament${activeTournaments !== 1 ? 's' : ''} in progress`
                                : 'Create your first tournament to get started.'}
                        </p>
                        {activeTournaments === 0 && (
                            <Link href={route('tournaments.create')} className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-display uppercase tracking-wide hover:bg-primary/30 transition-colors">
                                <Trophy className="h-4 w-4" /> New Tournament
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Tournaments', value: activeTournaments, color: 'text-primary', icon: Trophy },
                        { label: 'Live Now', value: liveMatches, color: 'text-secondary', icon: Activity },
                        { label: 'Players', value: totalPlayers, color: 'text-tertiary', icon: Users },
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="text-center">
                                <CardContent className="p-3">
                                    <Icon className={cn('h-4 w-4 mx-auto mb-1', stat.color)} />
                                    <div className={cn('text-2xl font-mono font-bold', stat.color)}>{stat.value}</div>
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-display">{stat.label}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Upcoming Matches */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em] px-1">Upcoming Matches</h3>

                    {upcomingMatches.length > 0 ? (
                        upcomingMatches.map((m) => (
                            <Card key={m.id} className="hover:bg-surface-container-high transition-colors group">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', m.sport === 'pickleball' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary')}>
                                        {m.sport === 'pickleball' ? <Zap className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-display text-sm uppercase tracking-tight truncate">
                                            {m.team_a} <span className="text-zinc-600 font-sans text-xs">vs</span> {m.team_b}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-600">
                                            <span className="font-display uppercase">{m.tournament}</span>
                                            {m.scheduled_at && (
                                                <>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <CalendarClock className="h-3 w-3" />
                                                        {m.scheduled_at}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-8 text-center">
                            <CalendarClock className="h-10 w-10 text-zinc-800 mx-auto mb-3" />
                            <p className="text-zinc-600 text-sm font-sans">No scheduled matches yet.</p>
                            <Link href={route('tournaments.index')} className="text-primary text-xs mt-2 inline-block font-display uppercase tracking-widest hover:underline">
                                View Tournaments →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Link href={route('tournaments.create')} className="flex flex-col items-center justify-center h-20 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                        <Trophy className="h-5 w-5 text-primary mb-1" />
                        <span className="text-[10px] font-display text-primary uppercase tracking-widest">New Tournament</span>
                    </Link>
                    <Link href={route('tournaments.index')} className="flex flex-col items-center justify-center h-20 rounded-xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-colors">
                        <Activity className="h-5 w-5 text-zinc-400 mb-1" />
                        <span className="text-[10px] font-display text-zinc-400 uppercase tracking-widest">All Arenas</span>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
