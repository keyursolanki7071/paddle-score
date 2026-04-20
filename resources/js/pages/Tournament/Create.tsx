import * as React from 'react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useForm } from '@inertiajs/react';
import { Zap, Target, Trophy, Users, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateProps {
    sports: Array<{ name: string; value: string }>;
    roundTypes: Array<{ name: string; value: string }>;
}

export default function TournamentCreate({ sports, roundTypes }: CreateProps) {
    const [selectedSport, setSelectedSport] = useState<'pickleball' | 'padel'>('pickleball');
    const isPickleball = selectedSport === 'pickleball';

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        sport: 'pickleball',
        description: '',
        max_players: 8,
        round_type: 'single_elimination',
        sets_to_win: 1,
        points_to_win: 11,
        win_by_two: true,
        games_to_win_set: 6,
    });

    const handleSportSelect = (sport: 'pickleball' | 'padel') => {
        setSelectedSport(sport);
        setData('sport', sport);
        if (sport === 'pickleball') {
            setData('points_to_win', 11);
            setData('games_to_win_set', 6);
        } else {
            setData('points_to_win', 7); // tiebreak
            setData('games_to_win_set', 6);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tournaments.store'));
    };

    return (
        <AppLayout title="New Tournament">
            <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center py-4">
                    <h2 className="text-2xl font-display uppercase tracking-tight">Create Arena</h2>
                    <p className="text-xs text-zinc-500 mt-1 font-sans">Set up your tournament bracket</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Sport Selector */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Sport Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'pickleball', label: 'Pickleball', icon: Zap, color: 'primary' },
                                { value: 'padel', label: 'Padel', icon: Target, color: 'secondary' },
                            ].map((sport) => {
                                const Icon = sport.icon;
                                const isSelected = selectedSport === sport.value;
                                return (
                                    <button
                                        key={sport.value}
                                        type="button"
                                        onClick={() => handleSportSelect(sport.value as any)}
                                        className={cn(
                                            'flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all',
                                            isSelected
                                                ? sport.color === 'primary'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-secondary bg-secondary/10 text-secondary'
                                                : 'border-white/10 bg-surface-container text-zinc-500 hover:border-white/20'
                                        )}
                                    >
                                        <Icon className="h-8 w-8 mb-2" />
                                        <span className="font-display uppercase tracking-tight">{sport.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tournament Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Tournament Name</label>
                        <Input
                            id="title"
                            placeholder={isPickleball ? 'e.g. Spring Pickleball Open' : 'e.g. City Padel Championship'}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="bg-surface-container border-transparent focus:border-b-primary"
                        />
                        {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Description (optional)</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Add a short description for participants..."
                            rows={3}
                            className="w-full bg-surface-container rounded-md p-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none focus:ring-1 focus:ring-primary/30"
                        />
                    </div>

                    {/* Max Teams */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Max Teams</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[4, 8, 16, 32].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setData('max_players', n)}
                                    className={cn(
                                        'py-3 rounded-lg text-sm font-display transition-all',
                                        data.max_players === n
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'bg-surface-container text-zinc-500 hover:bg-surface-container-high'
                                    )}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scoring Rules */}
                    <Card className="border-white/5">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="h-4 w-4 text-tertiary" />
                                <span className="text-[10px] font-display text-zinc-400 uppercase tracking-[0.2em]">Scoring Rules</span>
                            </div>

                            {/* Match Format */}
                            <div className="space-y-2">
                                <label className="text-xs text-zinc-500">Match Format (Sets to Win)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: 1, label: 'Best of 1' },
                                        { value: 2, label: 'Best of 3' },
                                        { value: 3, label: 'Best of 5' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setData('sets_to_win', opt.value)}
                                            className={cn(
                                                'py-2 px-3 rounded-lg text-xs font-display transition-all',
                                                data.sets_to_win === opt.value
                                                    ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                                                    : 'bg-surface-container text-zinc-500 hover:bg-surface-container-high'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pickleball specific */}
                            {isPickleball && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-zinc-500">Points to Win</label>
                                        <div className="flex gap-2 items-center">
                                            <button type="button" onClick={() => setData('points_to_win', Math.max(7, data.points_to_win - 1))} className="h-7 w-7 rounded bg-surface-container-high text-zinc-300 hover:bg-surface-container-highest">-</button>
                                            <span className="font-mono text-primary w-8 text-center">{data.points_to_win}</span>
                                            <button type="button" onClick={() => setData('points_to_win', Math.min(21, data.points_to_win + 1))} className="h-7 w-7 rounded bg-surface-container-high text-zinc-300 hover:bg-surface-container-highest">+</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-zinc-500">Win by 2</label>
                                        <button
                                            type="button"
                                            onClick={() => setData('win_by_two', !data.win_by_two)}
                                            className={cn('h-6 w-11 rounded-full transition-colors relative', data.win_by_two ? 'bg-primary' : 'bg-zinc-700')}
                                        >
                                            <div className={cn('h-4 w-4 rounded-full bg-black absolute top-1 transition-all', data.win_by_two ? 'left-6' : 'left-1')} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Padel specific */}
                            {!isPickleball && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-zinc-500">Games to Win a Set</label>
                                        <div className="flex gap-2 items-center">
                                            <button type="button" onClick={() => setData('games_to_win_set', Math.max(4, data.games_to_win_set - 1))} className="h-7 w-7 rounded bg-surface-container-high text-zinc-300 hover:bg-surface-container-highest">-</button>
                                            <span className="font-mono text-secondary w-8 text-center">{data.games_to_win_set}</span>
                                            <button type="button" onClick={() => setData('games_to_win_set', Math.min(9, data.games_to_win_set + 1))} className="h-7 w-7 rounded bg-surface-container-high text-zinc-300 hover:bg-surface-container-highest">+</button>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 p-2 bg-secondary/5 rounded-lg">
                                        <Info className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-zinc-500">Padel uses 0/15/30/40/Deuce/Advantage rules automatically. Tie-break at {data.games_to_win_set}-{data.games_to_win_set}.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        variant={isPickleball ? 'primary' : 'secondary'}
                        className="w-full h-14 text-base gap-2"
                        disabled={processing}
                    >
                        <ChevronRight className="h-5 w-5" />
                        {processing ? 'Creating...' : 'Create & Add Teams'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
