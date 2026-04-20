import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { usePage, Link, router } from '@inertiajs/react';
import { Trophy, Users, Zap, Target, ChevronRight, Play, GitBranch, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Team { id: string; name: string; }
interface MatchSet { set_number: number; team_a_score: number; team_b_score: number; team_a_games: number; team_b_games: number; winner_id: string | null; is_active: boolean; }
interface Match { id: string; tournament_id: string; team_a: Team | null; team_b: Team | null; status: string; round: number; sets: MatchSet[]; winner_id: string | null; scheduled_at: string | null; }
interface Registration { id: string; seed: number | null; team: { id: string; name: string; players: Array<{id: string; name: string; rank: string}>; }; }
interface Tournament {
    id: string; name: string; sport: string; status: string; description: string | null;
    round_type: string; sets_to_win: number; points_to_win: number; win_by_two: boolean; games_to_win_set: number; teams_count: number;
}

interface ShowProps {
    tournament: Tournament;
    registrations: Registration[];
    matchesByRound: Record<number, Match[]>;
}

export default function TournamentShow({ tournament, registrations, matchesByRound }: ShowProps) {
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const isPickleball = tournament.sport === 'pickleball';
    const accent = isPickleball ? 'text-primary' : 'text-secondary';
    const accentBg = isPickleball ? 'bg-primary/10' : 'bg-secondary/10';

    const totalMatches = Object.values(matchesByRound).flat().length;
    const liveMatches = Object.values(matchesByRound).flat().filter((m) => m.status === 'live');
    const hasMatches = totalMatches > 0;

    const startMatch = (matchId: string) => {
        router.post(route('matches.start', matchId));
    };

    return (
        <AppLayout title={tournament.name}>
            <div className="animate-in fade-in duration-500">
                {/* Hero Header */}
                <div className={cn('p-5 relative overflow-hidden', accentBg)}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            {isPickleball ? <Zap className={cn('h-5 w-5', accent)} /> : <Target className={cn('h-5 w-5', accent)} />}
                            <span className={cn('text-[10px] font-display uppercase tracking-[0.2em]', accent)}>{tournament.sport}</span>
                            <Badge variant={tournament.status as any} className="ml-auto">{tournament.status}</Badge>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-zinc-500 hover:text-red-500 transition-colors"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {tournament.status === 'completed' && (
                            <div className="mb-4 p-4 bg-primary/20 border border-primary/30 rounded-xl flex items-center gap-4 animate-in zoom-in duration-500">
                                <Trophy className="h-10 w-10 text-primary" />
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-primary font-display">Champion Crowned</h4>
                                    <p className="text-xl font-display uppercase text-white">
                                        {(() => {
                                            const matches = Object.values(matchesByRound).flat();
                                            const maxRound = Math.max(...Object.keys(matchesByRound).map(Number));
                                            const final = matches.find(m => m.round === maxRound);
                                            const winner = matches.find(m => m.id === final?.id)?.team_a?.id === final?.winner_id ? final?.team_a : final?.team_b;
                                            return winner?.name ?? 'TBD';
                                        })()} Won!
                                    </p>
                                </div>
                            </div>
                        )}

                        <h2 className="font-display text-2xl uppercase tracking-tight">{tournament.name}</h2>
                        {tournament.description && <p className="text-sm text-zinc-400 mt-1 font-sans">{tournament.description}</p>}

                        {/* Stats Row */}
                        <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {registrations.length} Teams</span>
                            <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {totalMatches} Matches</span>
                            <span className={cn('flex items-center gap-1', liveMatches.length > 0 ? accent : '')}>
                                {liveMatches.length > 0 ? `● ${liveMatches.length} Live` : 'No Live Matches'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {!hasMatches && registrations.length >= 2 && (
                            <Button variant={isPickleball ? 'primary' : 'secondary'} className="flex-1 gap-2" onClick={() => router.post(route('tournaments.generate-brackets', tournament.id))}>
                                <GitBranch className="h-4 w-4" /> Generate Brackets
                            </Button>
                        )}
                        <Link href={route('tournaments.bracket', tournament.id)} className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                                <GitBranch className="h-4 w-4" /> View Bracket
                            </Button>
                        </Link>
                        <Link href={route('tournaments.teams', tournament.id)}>
                            <Button variant="ghost" size="icon">
                                <Users className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Matches by Round */}
                    {hasMatches ? (
                        Object.entries(matchesByRound)
                            .sort(([a], [b]) => Number(a) - Number(b))
                            .map(([round, matches]) => (
                                <div key={round} className="space-y-3">
                                    <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">
                                        Round {round}
                                    </h3>
                                    {matches.map((match) => {
                                        const isLive = match.status === 'live';
                                        const isCompleted = match.status === 'completed';
                                        const isScheduled = match.status === 'scheduled';
                                        const activeSet = match.sets.find((s) => s.is_active);

                                        return (
                                            <Card key={match.id} className={cn('overflow-hidden transition-all', isLive ? `border-l-4 ${isPickleball ? 'border-l-primary' : 'border-l-secondary'}` : 'border-l-4 border-l-transparent')}>
                                                <CardContent className="p-4">
                                                    {/* Teams & Score */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex-1 space-y-1">
                                                            <div className={cn('font-display uppercase tracking-tight', match.winner_id === match.team_a.id ? accent : '')}>
                                                                {match.team_a.name}
                                                                {match.winner_id === match.team_a.id && <Trophy className="inline h-3 w-3 ml-1" />}
                                                            </div>
                                                            <div className={cn('font-display uppercase tracking-tight', match.winner_id === match.team_b.id ? accent : '')}>
                                                                {match.team_b.name}
                                                                {match.winner_id === match.team_b.id && <Trophy className="inline h-3 w-3 ml-1" />}
                                                            </div>
                                                        </div>

                                                        {/* Live Score */}
                                                        {(isLive || isCompleted) && activeSet && (
                                                            <div className="text-right">
                                                                <div className={cn('text-3xl font-mono leading-none', isPickleball ? 'text-primary' : 'text-secondary')}>
                                                                    {isPickleball ? activeSet.team_a_score : activeSet.team_a_games}
                                                                </div>
                                                                <div className="text-3xl font-mono leading-none text-zinc-400">
                                                                    {isPickleball ? activeSet.team_b_score : activeSet.team_b_games}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Past sets summary */}
                                                        {match.sets.length > 0 && (
                                                            <div className="ml-3 text-right space-y-1">
                                                                {match.sets.filter((s) => !s.is_active).map((s) => (
                                                                    <div key={s.set_number} className="text-[10px] text-zinc-600 font-mono">
                                                                        {isPickleball ? `${s.team_a_score}-${s.team_b_score}` : `${s.team_a_games}-${s.team_b_games}`}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={match.status as any}>{match.status}</Badge>

                                                        <div className="flex gap-2 ml-auto">
                                                            {isScheduled && (
                                                                <Button variant={isPickleball ? 'primary' : 'secondary'} size="sm" className="gap-1 h-7" onClick={() => startMatch(match.id)}>
                                                                    <Play className="h-3 w-3" /> Start
                                                                </Button>
                                                            )}
                                                            {isLive && (
                                                                <Link href={route('matches.score', match.id)}>
                                                                    <Button variant={isPickleball ? 'primary' : 'secondary'} size="sm" className="gap-1 h-7">
                                                                        <ChevronRight className="h-3 w-3" /> Score
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            {isCompleted && (
                                                                <Link href={route('matches.summary', match.id)}>
                                                                    <Button variant="ghost" size="sm" className="gap-1 h-7 text-zinc-500">
                                                                        Summary
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ))
                    ) : (
                        <div className="py-12 text-center">
                            <GitBranch className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                            <h3 className="font-display uppercase tracking-widest text-zinc-500 mb-2">No Brackets Yet</h3>
                            {registrations.length < 2 ? (
                                <>
                                    <p className="text-sm text-zinc-600 font-sans">Add at least 2 teams to generate brackets.</p>
                                    <Link href={route('tournaments.teams', tournament.id)} className="mt-3 inline-block">
                                        <Button variant="primary" size="sm">Add Teams</Button>
                                    </Link>
                                </>
                            ) : (
                                <p className="text-sm text-zinc-600 font-sans">{registrations.length} teams ready. Click "Generate Brackets" above.</p>
                            )}
                        </div>
                    )}

                    {/* Registered Teams */}
                    {registrations.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Teams ({registrations.length})</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {registrations.map((r) => (
                                    <Card key={r.id} className="text-center">
                                        <CardContent className="p-3">
                                            <div className="font-display uppercase text-sm tracking-tight truncate">{r.team.name}</div>
                                            {r.seed && <div className="text-[10px] text-zinc-600">Seed #{r.seed}</div>}
                                            <div className="text-[10px] text-zinc-600 mt-1">{r.team.players.length} player{r.team.players.length !== 1 ? 's' : ''}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Tournament?"
                message={`Are you sure you want to delete "${tournament.name}"? This will permanently erase all matches, points, and standings.`}
                confirmLabel="Delete Everything"
                onConfirm={() => {
                    router.delete(route('tournaments.destroy', tournament.id), {
                        onSuccess: () => setShowDeleteModal(false)
                    });
                }}
                onCancel={() => setShowDeleteModal(false)}
                variant="danger"
            />
        </AppLayout>
    );
}
