import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, Share2, Users, Calendar, MapPin, Zap, Target, ChevronRight, Play } from 'lucide-react';

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
                        <Button className="flex-1 gap-2" variant={isPickleball ? "primary" : "secondary"}>
                            <Play className="h-4 w-4" /> Start Match
                        </Button>
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

                            {[1, 2].map((m) => (
                                <div key={m} className="relative">
                                    <Card className="border-l-4 border-l-primary/30">
                                        <CardContent className="p-0">
                                            <div className="flex items-center divide-x divide-white/5">
                                                <div className="flex-1 p-3 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            Team ALPHA
                                                        </span>
                                                        <span className="text-lg font-mono text-primary">11</span>
                                                    </div>
                                                    <div className="flex items-center justify-between opacity-50">
                                                        <span className="text-sm font-medium flex items-center gap-2 text-zinc-400">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                                                            Team BRAVO
                                                        </span>
                                                        <span className="text-lg font-mono">08</span>
                                                    </div>
                                                </div>
                                                <div className="w-12 flex items-center justify-center bg-surface-container-highest/30">
                                                    <ChevronRight className="h-5 w-5 text-zinc-700" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    {/* Bracket Connection Line Mock */}
                                    <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-white/5" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
