import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@inertiajs/react';

interface TournamentDetailProps {

    tournament: {
        id: string;
        name: string;
        sport: 'pickleball' | 'padel';
        status: 'live' | 'scheduled' | 'completed';
        description: string;
    };
}

export default function TournamentShow({ tournament }: TournamentDetailProps) {
    const isPickleball = tournament.sport === 'pickleball';
    const accentColor = isPickleball ? 'text-primary' : 'text-secondary';
    const accentBg = isPickleball ? 'bg-primary/10' : 'bg-secondary/10';

    return (
        <AppLayout title={tournament.name}>
            <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                {/* Header Section */}
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge variant={tournament.status as any}>{tournament.status}</Badge>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${accentBg} ${accentColor}`}>
                            {isPickleball ? <Zap className="h-8 w-8" /> : <Target className="h-8 w-8" />}
                        </div>
                        <div>
                            <h2 className="font-display text-2xl uppercase tracking-tight">{tournament.name}</h2>
                            <p className="text-xs text-zinc-500 font-sans flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Downtown Arena, Court 4
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                        {tournament.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                        <Link href={route('tournaments.scoring', tournament.id)} className="flex-1">
                            <Button className="w-full gap-2" variant={isPickleball ? "primary" : "secondary"}>
                                <Play className="h-4 w-4" /> Start Match
                            </Button>
                        </Link>
                        <Button className="flex-1" variant="outline">Schedule</Button>
                    </div>
                </div>

                {/* Brackets / Matches Tabs Component Concept */}
                <div className="mt-4">
                    <div className="flex px-4 border-b border-white/5 bg-surface/50 h-12">
                        <button className="flex-1 text-xs uppercase font-display tracking-widest text-primary border-b-2 border-primary">Live Brackets</button>
                        <button className="flex-1 text-xs uppercase font-display tracking-widest text-zinc-600 hover:text-zinc-400">Match Log</button>
                        <button className="flex-1 text-xs uppercase font-display tracking-widest text-zinc-600 hover:text-zinc-400">Players</button>
                    </div>

                    <div className="p-4 space-y-6 bg-background">
                        {/* Bracket Round Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Quarter Finals</h3>
                                <Badge variant="outline">Round 1</Badge>
                            </div>

                            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-2xl bg-surface/30">
                                <Trophy className="h-10 w-10 text-zinc-800 mx-auto mb-4 opacity-50" />
                                <h4 className="text-zinc-400 font-display uppercase tracking-widest text-sm mb-1">No Active Matches</h4>
                                <p className="text-xs text-zinc-600 font-sans italic">Brackets will appear once the tournament starts.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
