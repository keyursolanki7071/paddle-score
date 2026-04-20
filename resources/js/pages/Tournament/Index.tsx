import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trophy, Search, Plus, Filter, Users, ChevronRight, Zap, Target } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Tournament {
    id: string;
    name: string;
    sport: 'pickleball' | 'padel';
    status: 'live' | 'scheduled' | 'completed';
    players: number;
}

interface TournamentIndexProps {
    tournaments: Tournament[];
}

export default function TournamentIndex({ tournaments }: TournamentIndexProps) {
    return (
        <AppLayout title="Tournaments">
            <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Search & Actions */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input placeholder="Search arenas..." className="pl-9 bg-surface-container border-transparent" />
                    </div>
                    <Button variant="sport" size="icon">
                        <Filter className="h-5 w-5" />
                    </Button>
                </div>

                {/* Floating Action Button Concept */}
                <Link href={route('tournaments.create')} className="block">
                    <Button className="w-full h-12 gap-2" variant="tertiary">
                        <Plus className="h-5 w-5" />
                        New Tournament
                    </Button>
                </Link>

                {/* Tournament List */}
                <div className="space-y-4">
                    <h2 className="text-sm font-display text-zinc-500 uppercase tracking-widest px-1">Active Circuits</h2>
                    
                    {tournaments.map((t) => (
                        <Link key={t.id} href={route('tournaments.show', t.id)} className="block">
                            <Card className="hover:bg-surface-container-highest transition-all group overflow-hidden border-l-4 border-l-transparent active:scale-[0.98]">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                                            t.sport === 'pickleball' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                            {t.sport === 'pickleball' ? <Zap className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-display text-lg tracking-tight group-hover:text-white">{t.name}</h3>
                                                <Badge variant={t.status as any}>{t.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 font-sans">
                                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.players} Players</span>
                                                <span className="uppercase tracking-widest">{t.sport}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-primary transition-colors" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Empty State / Bottom Note */}
                <div className="py-8 text-center">
                    <Trophy className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500 text-sm font-sans italic">Hosting a major? Start your bracket above.</p>
                </div>
            </div>
        </AppLayout>
    );
}


