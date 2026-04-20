import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RotateCcw, ArrowLeftRight, Clock, Trophy, History } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScoringProps {
    match: {
        id: string;
        teamA: string;
        teamB: string;
        sport: 'pickleball' | 'padel';
        settings: { maxScore: number; winByTwo: boolean };
    };
}

export default function TournamentScoring({ match }: ScoringProps) {
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [time, setTime] = useState(0);
    const isPickleball = match.sport === 'pickleball';

    useEffect(() => {
        const timer = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <AppLayout title="Live Scorekeeping">
            <div className="flex flex-col h-[calc(100vh-144px)] animate-in fade-in zoom-in-95 duration-500">
                {/* Status Bar */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 bg-surface/30">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(time)}
                        </div>
                        <Badge variant="live">Match In Progress</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-zinc-400">
                        <History className="h-4 w-4" /> Log
                    </Button>
                </div>

                {/* Score Grid */}
                <div className="flex-1 grid grid-cols-1 gap-px bg-white/5 overflow-hidden">
                    {/* Team A */}
                    <div className="relative bg-background flex flex-col items-center justify-center p-6">
                        <div className="absolute top-4 left-4">
                           <span className="text-[10px] font-display uppercase tracking-widest text-zinc-500">Home Team</span>
                           <h3 className="font-display text-lg uppercase tracking-tight">{match.teamA}</h3>
                        </div>
                        <div className="text-[140px] font-mono leading-none tracking-tighter text-primary drop-shadow-[0_0_30px_rgba(117,255,158,0.2)]">
                            {scoreA.toString().padStart(2, '0')}
                        </div>
                        <div className="flex gap-4 mt-4 w-full max-w-[240px]">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-16 text-2xl"
                                onClick={() => setScoreA(Math.max(0, scoreA - 1))}
                            >-</Button>
                            <Button 
                                variant="primary" 
                                className="flex-[2] h-16 text-3xl"
                                onClick={() => setScoreA(scoreA + 1)}
                            >+</Button>
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="relative bg-background flex flex-col items-center justify-center p-6">
                        <div className="absolute top-4 right-4 text-right">
                           <span className="text-[10px] font-display uppercase tracking-widest text-zinc-500">Away Team</span>
                           <h3 className="font-display text-lg uppercase tracking-tight">{match.teamB}</h3>
                        </div>
                        <div className="text-[140px] font-mono leading-none tracking-tighter text-zinc-100 opacity-80">
                            {scoreB.toString().padStart(2, '0')}
                        </div>
                        <div className="flex gap-4 mt-4 w-full max-w-[240px]">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-16 text-2xl"
                                onClick={() => setScoreB(Math.max(0, scoreB - 1))}
                            >-</Button>
                            <Button 
                                variant="white" 
                                className="flex-[2] h-16 text-3xl bg-zinc-100 text-black hover:bg-zinc-200"
                                onClick={() => setScoreB(scoreB + 1)}
                            >+</Button>
                        </div>
                    </div>
                </div>

                {/* Score Controls Floating */}
                <div className="p-4 bg-surface-container/50 backdrop-blur-md flex justify-around items-center border-t border-white/5">
                    <button className="flex flex-col items-center gap-1 group" onClick={() => { setScoreA(0); setScoreB(0); setTime(0) }}>
                        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                            <RotateCcw className="h-5 w-5 text-zinc-500" />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500">Reset</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="h-12 w-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:bg-tertiary/20">
                            <ArrowLeftRight className="h-6 w-6 text-tertiary" />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-tertiary">Switch</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group">
                        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                            <Trophy className="h-5 w-5 text-zinc-500" />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500">Finish</span>
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
