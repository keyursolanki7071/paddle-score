import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { router } from '@inertiajs/react';
import { RotateCcw, ArrowLeftRight, Clock, Trophy, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchSet {
    set_number: number;
    team_a_score: number;
    team_b_score: number;
    team_a_games: number;
    team_b_games: number;
    winner_id: string | null;
    is_active: boolean;
}

interface ScoreProps {
    match: {
        id: string;
        tournament_id: string;
        team_a: { id: string; name: string };
        team_b: { id: string; name: string };
        server_team_id: string;
        status: string;
        sport: 'pickleball' | 'padel';
        sets_to_win: number;
        points_to_win: number;
        win_by_two: boolean;
        games_to_win_set: number;
    };
    activeSet: {
        id: string;
        set_number: number;
        team_a_score: number;
        team_b_score: number;
        team_a_games: number;
        team_b_games: number;
    } | null;
    sets: MatchSet[];
}

export default function MatchScore({ match, activeSet, sets }: ScoreProps) {
    const [serverTeamId, setServerTeamId] = useState(match.server_team_id);
    const [currentSet, setCurrentSet] = useState(activeSet);
    const [allSets, setAllSets] = useState(sets);
    const [time, setTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [winnerModal, setWinnerModal] = useState<string | null>(null);
    const [displayScoreA, setDisplayScoreA] = useState<string>('0');
    const [displayScoreB, setDisplayScoreB] = useState<string>('0');

    const isPadel = match.sport === 'padel';
    const accentColor = isPadel ? 'text-secondary' : 'text-primary';
    const accentBg = isPadel ? 'bg-secondary' : 'bg-primary';

    useEffect(() => {
        const timer = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const setWins = (teamId: string) => allSets.filter((s) => s.winner_id === teamId).length;

    const recordPoint = useCallback(async (teamId: string) => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const response = await fetch(route('matches.record-point', match.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
                body: JSON.stringify({ winner_team_id: teamId }),
            });

            const result = await response.json();

            if (result.match) {
                const freshMatch = result.match;
                const freshSet = freshMatch.sets?.find((s: MatchSet) => s.is_active);
                setCurrentSet(freshSet ?? null);
                setAllSets(freshMatch.sets ?? []);
                setServerTeamId(freshMatch.server_team_id);

                if (isPadel) {
                    setDisplayScoreA(result.display_score_a ?? '0');
                    setDisplayScoreB(result.display_score_b ?? '0');
                }

                if (result.match_winner) {
                    setWinnerModal(result.match_winner);
                }
            }
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing, match.id, isPadel]);

    const undoPoint = async () => {
        const response = await fetch(route('matches.undo-point', match.id), {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        });
        const result = await response.json();
        if (result.match) {
            const freshSet = result.match.sets?.find((s: MatchSet) => s.is_active);
            setCurrentSet(freshSet ?? null);
            setAllSets(result.match.sets ?? []);
            setServerTeamId(result.match.server_team_id);
        }
    };

    const switchServe = async () => {
        const response = await fetch(route('matches.switch-serve', match.id), {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        });
        const result = await response.json();
        setServerTeamId(result.server_team_id);
    };

    const finishMatch = async () => {
        // Redirection to summary page. The match is already finalized in the background.
        router.get(route('matches.summary', match.id));
    };

    const getDisplayScore = (team: 'a' | 'b') => {
        if (!currentSet) return '00';
        const score = team === 'a' ? currentSet.team_a_score : currentSet.team_b_score;
        if (isPadel) return team === 'a' ? displayScoreA : displayScoreB;
        return score.toString().padStart(2, '0');
    };

    return (
        <AppLayout title="Live Match">
            {/* Winner Modal */}
            {winnerModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6">
                    <div className="w-full max-w-sm bg-surface rounded-2xl p-8 text-center animate-in zoom-in duration-300 shadow-2xl border border-white/5">
                        <div className="flex justify-center mb-6">
                            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                        </div>
                        <h2 className="font-display text-3xl uppercase tracking-tight text-primary mb-1">
                            {winnerModal === match.team_a.id ? match.team_a.name : match.team_b.name}
                        </h2>
                        <p className="text-zinc-400 mb-6 font-sans text-sm">Wins this match!</p>
                        <Button variant="primary" className="w-full h-14" onClick={finishMatch}>
                            <Trophy className="h-5 w-5 mr-2" /> View Match Summary
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex flex-col h-[calc(100vh-144px)]">
                {/* Status Bar */}
                <div className="p-3 flex items-center justify-between border-b border-white/5 bg-surface/30">
                    <div className="flex items-center gap-3">
                        <Badge variant="live">● Live</Badge>
                        <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {formatTime(time)}
                        </span>
                    </div>

                    {/* Set Score Tracker */}
                    <div className="flex items-center gap-2">
                        {allSets.map((s) => (
                            <div key={s.set_number} className={cn('text-[10px] font-mono', s.is_active ? accentColor : 'text-zinc-600')}>
                                {isPadel ? `${s.team_a_games}-${s.team_b_games}` : `S${s.set_number}`}
                            </div>
                        ))}
                        <div className="text-[10px] text-zinc-600 font-display ml-2">
                            {setWins(match.team_a.id)}-{setWins(match.team_b.id)}
                        </div>
                    </div>
                </div>

                {/* Score Grid */}
                <div className="flex-1 grid grid-cols-1 gap-px bg-white/5">
                    {/* Team A */}
                    <div className="relative bg-background flex flex-col items-center justify-center p-6">
                        <div className="absolute top-4 left-4">
                            <span className="text-[10px] font-display uppercase tracking-widest text-zinc-500">
                                {serverTeamId === match.team_a.id && '▶ '}Home
                            </span>
                            <h3 className={cn('font-display text-lg uppercase tracking-tight', serverTeamId === match.team_a.id ? accentColor : '')}>{match.team_a.name}</h3>
                            {isPadel && currentSet && (
                                <span className="text-xs text-zinc-600 font-mono">{currentSet.team_a_games} games</span>
                            )}
                        </div>

                        <div className={cn('text-[120px] font-mono leading-none tracking-tighter drop-shadow-xl', accentColor)}>
                            {getDisplayScore('a')}
                        </div>

                        <div className="flex gap-3 mt-4 w-full max-w-[260px]">
                            <Button variant="outline" className="flex-1 h-16 text-2xl" onClick={() => {}} disabled={isProcessing}>-</Button>
                            <Button
                                variant={isPadel ? 'secondary' : 'primary'}
                                className="flex-[2] h-16 text-3xl font-bold"
                                onClick={() => recordPoint(match.team_a.id)}
                                disabled={isProcessing}
                            >
                                + POINT
                            </Button>
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="relative bg-background flex flex-col items-center justify-center p-6">
                        <div className="absolute top-4 right-4 text-right">
                            <span className="text-[10px] font-display uppercase tracking-widest text-zinc-500">
                                {serverTeamId === match.team_b.id && '▶ '}Away
                            </span>
                            <h3 className={cn('font-display text-lg uppercase tracking-tight', serverTeamId === match.team_b.id ? accentColor : '')}>{match.team_b.name}</h3>
                            {isPadel && currentSet && (
                                <span className="text-xs text-zinc-600 font-mono">{currentSet.team_b_games} games</span>
                            )}
                        </div>

                        <div className="text-[120px] font-mono leading-none tracking-tighter text-zinc-100 opacity-80">
                            {getDisplayScore('b')}
                        </div>

                        <div className="flex gap-3 mt-4 w-full max-w-[260px]">
                            <Button variant="outline" className="flex-1 h-16 text-2xl" onClick={() => {}} disabled={isProcessing}>-</Button>
                            <Button
                                variant="outline"
                                className="flex-[2] h-16 text-3xl font-bold bg-zinc-100 text-black hover:bg-zinc-200"
                                onClick={() => recordPoint(match.team_b.id)}
                                disabled={isProcessing}
                            >
                                + POINT
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Control Bar */}
                <div className="p-4 bg-surface-container/50 backdrop-blur-md flex justify-around items-center border-t border-white/5">
                    <button className="flex flex-col items-center gap-1 group" onClick={undoPoint}>
                        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                            <RotateCcw className="h-5 w-5 text-zinc-500" />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500">Undo</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group" onClick={switchServe}>
                        <div className="h-12 w-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:bg-tertiary/20">
                            <ArrowLeftRight className="h-6 w-6 text-tertiary" />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-tertiary">Switch&nbsp;Serve</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group" onClick={() => setWinnerModal(null)}>
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
