import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/Card';
import { Trophy, Zap, Target, Share2, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointLog {
    set_number: number;
    scored_by: string;
    team_a_score: number;
    team_b_score: number;
    created_at: string;
}

interface SummaryProps {
    match: {
        id: string;
        team_a: { id: string; name: string };
        team_b: { id: string; name: string };
        winner: { id: string; name: string } | null;
        tournament: { id: string; name: string };
        sport: string;
        completed_at: string | null;
    };
    sets: Array<{
        set_number: number;
        team_a_score: number;
        team_b_score: number;
        team_a_games: number;
        team_b_games: number;
        winner_id: string | null;
    }>;
    pointLog: PointLog[];
}

export default function MatchSummary({ match, sets, pointLog }: SummaryProps) {
    const isPadel = match.sport === 'padel';
    const isPickleball = !isPadel;
    const accent = isPickleball ? 'text-primary' : 'text-secondary';
    const accentBg = isPickleball ? 'bg-primary/10' : 'bg-secondary/10';
    const winnerIsA = match.winner?.id === match.team_a.id;

    const teamASetWins = sets.filter((s) => s.winner_id === match.team_a.id).length;
    const teamBSetWins = sets.filter((s) => s.winner_id === match.team_b.id).length;

    return (
        <AppLayout title="Match Summary">
            <div className="animate-in fade-in duration-700 space-y-0">
                {/* Back + Share */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <Link href={route('tournaments.show', match.tournament.id)} className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white">
                        <ChevronLeft className="h-4 w-4" /> {match.tournament.name}
                    </Link>
                    <button className="p-2 rounded hover:bg-white/5 text-zinc-500">
                        <Share2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Winner Banner */}
                {match.winner && (
                    <div className={cn('p-8 text-center', accentBg)}>
                        <div className="flex items-center justify-center gap-3 mb-3">
                            {isPickleball ? <Zap className={cn('h-8 w-8', accent)} /> : <Target className={cn('h-8 w-8', accent)} />}
                            <Trophy className="h-10 w-10 text-yellow-400" />
                            {isPickleball ? <Zap className={cn('h-8 w-8', accent)} /> : <Target className={cn('h-8 w-8', accent)} />}
                        </div>
                        <h2 className={cn('font-display text-3xl uppercase tracking-tight mb-1', accent)}>{match.winner.name}</h2>
                        <p className="text-zinc-400 text-sm font-sans">Wins the Match</p>
                        {match.completed_at && (
                            <p className="text-[10px] text-zinc-600 mt-2 font-mono">{match.completed_at}</p>
                        )}
                    </div>
                )}

                {/* Set-by-Set Score */}
                <div className="p-4 space-y-3">
                    <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Set Results</h3>

                    {/* Team Headers */}
                    <div className="grid grid-cols-3 text-center text-[10px] font-display uppercase tracking-widest text-zinc-600">
                        <div className={cn('text-left font-bold', winnerIsA ? accent : '')}>{match.team_a.name}</div>
                        <div>Set</div>
                        <div className={cn('text-right font-bold', !winnerIsA ? accent : '')}>{match.team_b.name}</div>
                    </div>

                    {sets.map((s) => {
                        const aWon = s.winner_id === match.team_a.id;
                        const bWon = s.winner_id === match.team_b.id;
                        const scoreLabel = isPadel
                            ? `${s.team_a_games}-${s.team_b_games}`
                            : `${s.team_a_score}-${s.team_b_score}`;
                        return (
                            <div key={s.set_number} className="grid grid-cols-3 text-center items-center">
                                <div className={cn('text-2xl font-mono text-left', aWon ? accent : 'text-zinc-500')}>
                                    {isPadel ? s.team_a_games : s.team_a_score}
                                </div>
                                <div className="text-[10px] text-zinc-600 font-display uppercase">Set {s.set_number}</div>
                                <div className={cn('text-2xl font-mono text-right', bWon ? accent : 'text-zinc-500')}>
                                    {isPadel ? s.team_b_games : s.team_b_score}
                                </div>
                            </div>
                        );
                    })}

                    {/* Match Score Summary */}
                    <div className="grid grid-cols-3 text-center items-center pt-3 border-t border-white/5">
                        <div className={cn('text-3xl font-display font-bold text-left', winnerIsA ? accent : 'text-zinc-500')}>{teamASetWins}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Sets</div>
                        <div className={cn('text-3xl font-display font-bold text-right', !winnerIsA ? accent : 'text-zinc-500')}>{teamBSetWins}</div>
                    </div>
                </div>

                {/* Point Timeline */}
                {pointLog.length > 0 && (
                    <div className="p-4 space-y-3">
                        <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Point Timeline</h3>
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                            {pointLog.map((p, i) => (
                                <div key={i} className="flex items-center justify-between text-[10px] font-mono py-1 border-b border-white/5">
                                    <span className={cn('font-display uppercase tracking-wide', p.scored_by === match.team_a.name ? accent : 'text-zinc-400')}>
                                        {p.scored_by}
                                    </span>
                                    <span className="text-zinc-600">
                                        {p.team_a_score} – {p.team_b_score}
                                    </span>
                                    <span className="text-zinc-700">{p.created_at}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
