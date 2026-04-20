import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { Trophy, Zap, Target, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchInBracket {
    id: string;
    team_a: { id: string; name: string };
    team_b: { id: string; name: string };
    status: 'scheduled' | 'live' | 'completed';
    winner_id: string | null;
    set_score: string;
}

interface Round {
    round: number;
    label: string;
    matches: MatchInBracket[];
}

interface BracketProps {
    tournament: { id: string; name: string; sport: string };
    rounds: Round[];
}

export default function TournamentBracket({ tournament, rounds }: BracketProps) {
    const isPickleball = tournament.sport === 'pickleball';
    const accent = isPickleball ? 'text-primary' : 'text-secondary';
    const accentBorder = isPickleball ? 'border-l-primary' : 'border-l-secondary';

    return (
        <AppLayout title="Bracket">
            <div className="animate-in fade-in duration-700">
                {/* Header */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', isPickleball ? 'bg-primary/10' : 'bg-secondary/10')}>
                            {isPickleball ? <Zap className={cn('h-5 w-5', accent)} /> : <Target className={cn('h-5 w-5', accent)} />}
                        </div>
                        <div>
                            <h2 className="font-display text-xl uppercase tracking-tight">{tournament.name}</h2>
                            <p className={cn('text-[10px] font-display uppercase tracking-widest', accent)}>Live Bracket</p>
                        </div>
                    </div>
                </div>

                {/* Bracket Rounds */}
                <div className="overflow-x-auto">
                    <div className="flex gap-0 min-w-max p-4">
                        {rounds.map((round, roundIdx) => (
                            <div key={round.round} className="flex flex-col" style={{ width: 200 }}>
                                {/* Round Header */}
                                <div className="mb-4 px-3">
                                    <p className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">{round.label}</p>
                                </div>

                                {/* Matches in this round */}
                                <div className="flex flex-col gap-4">
                                    {round.matches.map((match) => {
                                        const isLive = match.status === 'live';
                                        const isCompleted = match.status === 'completed';
                                        return (
                                            <Link
                                                key={match.id}
                                                href={isLive ? route('matches.score', match.id) : (isCompleted ? route('matches.summary', match.id) : '#')}
                                                className="block mx-3"
                                            >
                                                <div className={cn(
                                                    'border-l-2 bg-surface-container rounded-r-lg overflow-hidden transition-all',
                                                    isLive ? accentBorder + ' shadow-[0_0_20px_rgba(117,255,158,0.1)]' : 'border-l-white/10',
                                                    isCompleted ? 'opacity-70' : '',
                                                )}>
                                                    {/* Team A */}
                                                    <div className={cn(
                                                        'px-3 py-2.5 flex items-center justify-between border-b border-white/5',
                                                        match.winner_id === match.team_a.id ? 'bg-primary/10' : ''
                                                    )}>
                                                        <span className={cn('text-xs font-display uppercase tracking-tight truncate max-w-[100px]',
                                                            match.winner_id === match.team_a.id ? accent : 'text-zinc-200'
                                                        )}>{match.team_a.name}</span>
                                                        {match.winner_id === match.team_a.id && <Trophy className={cn('h-3 w-3 shrink-0', accent)} />}
                                                    </div>
                                                    {/* Team B */}
                                                    <div className={cn(
                                                        'px-3 py-2.5 flex items-center justify-between',
                                                        match.winner_id === match.team_b.id ? 'bg-primary/10' : ''
                                                    )}>
                                                        <span className={cn('text-xs font-display uppercase tracking-tight truncate max-w-[100px]',
                                                            match.winner_id === match.team_b.id ? accent : 'text-zinc-200'
                                                        )}>{match.team_b.name}</span>
                                                        {match.winner_id === match.team_b.id && <Trophy className={cn('h-3 w-3 shrink-0', accent)} />}
                                                    </div>

                                                    {/* Status Footer */}
                                                    {isLive && (
                                                        <div className={cn('px-3 py-1 text-[8px] uppercase tracking-widest font-display', accent)}>
                                                            ● LIVE
                                                        </div>
                                                    )}
                                                    {isCompleted && match.set_score && (
                                                        <div className="px-3 py-1 text-[8px] text-zinc-600 uppercase tracking-widest font-mono">
                                                            {match.set_score}
                                                        </div>
                                                    )}
                                                    {match.status === 'scheduled' && (
                                                        <div className="px-3 py-1 text-[8px] text-zinc-700 uppercase tracking-widest font-display">
                                                            Scheduled
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Trophy at the end */}
                        {rounds.length > 0 && (
                            <div className="flex flex-col justify-center items-center px-6" style={{ width: 80 }}>
                                <div className="h-16 w-16 rounded-full bg-tertiary/10 flex items-center justify-center">
                                    <Trophy className="h-8 w-8 text-tertiary" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty state */}
                {rounds.length === 0 && (
                    <div className="p-12 text-center">
                        <Trophy className="h-16 w-16 text-zinc-800 mx-auto mb-4 opacity-50" />
                        <h3 className="font-display uppercase tracking-widest text-zinc-400 mb-2">No Bracket Yet</h3>
                        <p className="text-xs text-zinc-600 font-sans">Register at least 2 teams and generate brackets to see the draw.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
