import * as React from 'react';
import { Trophy, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicMatch {
    id: string;
    team_a: string;
    team_b: string;
    status: 'scheduled' | 'live' | 'completed';
    winner_id: string | null;
    set_score: string;
}

interface PublicProps {
    tournament: { id: string; name: string; sport: string; status: string };
    rounds: PublicMatch[][];
}

export default function TournamentPublic({ tournament, rounds }: PublicProps) {
    const isPickleball = tournament.sport === 'pickleball';
    const accent = isPickleball ? 'text-primary' : 'text-secondary';
    const accentBorder = isPickleball ? 'border-l-primary' : 'border-l-secondary';

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-zinc-100">
            {/* Public Header (no nav) */}
            <header className="border-b border-white/5 p-4 flex items-center gap-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', isPickleball ? 'bg-primary/10' : 'bg-secondary/10')}>
                    {isPickleball ? <Zap className={cn('h-5 w-5', accent)} /> : <Target className={cn('h-5 w-5', accent)} />}
                </div>
                <div>
                    <h1 className="font-display text-xl uppercase tracking-tight">{tournament.name}</h1>
                    <p className={cn('text-[10px] uppercase tracking-widest font-display', accent)}>{tournament.sport} · {tournament.status}</p>
                </div>
                <div className="ml-auto">
                    <span className="text-[10px] text-zinc-600 font-sans">PaddleScore</span>
                </div>
            </header>

            {/* Bracket */}
            <div className="p-4 overflow-x-auto">
                <div className="flex gap-0 min-w-max">
                    {rounds.map((round, rIdx) => (
                        <div key={rIdx} style={{ width: 180 }}>
                            <p className="text-[10px] font-display text-zinc-600 uppercase tracking-[0.2em] mb-4 px-3">
                                {rIdx === rounds.length - 1 ? 'Final' : rIdx === rounds.length - 2 ? 'Semi Finals' : `Round ${rIdx + 1}`}
                            </p>
                            <div className="flex flex-col gap-3">
                                {round.map((match, mIdx) => (
                                    <div key={mIdx} className={cn('mx-3 border-l-2 rounded-r-lg overflow-hidden', match.status === 'live' ? accentBorder : 'border-l-white/10')}>
                                        <div className="px-3 py-2 text-xs font-display uppercase border-b border-white/5 bg-surface-container truncate">{match.team_a}</div>
                                        <div className="px-3 py-2 text-xs font-display uppercase bg-surface-container truncate">{match.team_b}</div>
                                        {match.status === 'live' && (
                                            <div className={cn('px-3 py-1 text-[8px] uppercase tracking-widest', accent)}>● Live</div>
                                        )}
                                        {match.status === 'completed' && match.set_score && (
                                            <div className="px-3 py-1 text-[8px] text-zinc-700 font-mono">{match.set_score}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-center px-6" style={{ width: 60 }}>
                        <Trophy className="h-8 w-8 text-zinc-800" />
                    </div>
                </div>
            </div>

            {rounds.length === 0 && (
                <div className="py-20 text-center text-zinc-600 text-sm font-sans">Brackets not yet generated.</div>
            )}

            <div className="text-center py-8 text-[10px] text-zinc-800 font-sans">Powered by PaddleScore</div>
        </div>
    );
}
