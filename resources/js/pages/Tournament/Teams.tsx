import * as React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useForm, router } from '@inertiajs/react';
import { Users, Plus, Trash2, ChevronRight, UserPlus, Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Player { id: string; name: string; }
interface Team { id: string; name: string; players: Player[]; }
interface TeamsProps {
    tournament: { id: string; name: string; sport: string; max_players: number; };
    allTeams: Team[];
    registeredTeamIds: string[];
}

export default function TournamentTeams({ tournament, allTeams, registeredTeamIds }: TeamsProps) {
    const [search, setSearch] = useState('');
    const [showNewTeam, setShowNewTeam] = useState(false);

    const newTeamForm = useForm({ name: '', player1: '', player2: '' });

    const filteredTeams = allTeams.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddTeam = (teamId: string) => {
        router.post(route('tournaments.add-team', tournament.id), { team_id: teamId }, { preserveScroll: true });
    };

    const handleRemoveTeam = (teamId: string) => {
        router.delete(route('tournaments.remove-team', tournament.id), { data: { team_id: teamId }, preserveScroll: true });
    };

    const handleGenerateBrackets = () => {
        router.post(route('tournaments.generate-brackets', tournament.id));
    };

    const registeredTeams = allTeams.filter((t) => registeredTeamIds.includes(t.id));

    return (
        <AppLayout title="Add Teams">
            <div className="p-4 space-y-6 animate-in fade-in duration-700">
                {/* Header */}
                <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-display">Step 2 of 2</p>
                    <h2 className="text-xl font-display uppercase tracking-tight">{tournament.name}</h2>
                    <p className="text-xs text-zinc-500">{registeredTeamIds.length} / {tournament.max_players} teams registered</p>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(registeredTeamIds.length / tournament.max_players) * 100}%` }}
                    />
                </div>

                {/* Registered Teams */}
                {registeredTeams.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-display text-zinc-400 uppercase tracking-[0.2em]">Registered</h3>
                        {registeredTeams.map((team) => (
                            <Card key={team.id} className="border-l-4 border-l-primary/50">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div>
                                        <div className="font-display text-sm uppercase">{team.name}</div>
                                        {team.players.length > 0 && (
                                            <div className="text-[10px] text-zinc-500 mt-0.5">{team.players.map((p) => p.name).join(', ')}</div>
                                        )}
                                    </div>
                                    <button onClick={() => handleRemoveTeam(team.id)} className="h-8 w-8 rounded flex items-center justify-center hover:bg-red-400/10 text-zinc-600 hover:text-red-400 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Available Teams */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-display text-zinc-400 uppercase tracking-[0.2em]">Available Teams</h3>
                        <button onClick={() => setShowNewTeam(!showNewTeam)} className="flex items-center gap-1 text-[10px] text-primary uppercase tracking-widest">
                            <Plus className="h-3 w-3" /> New Team
                        </button>
                    </div>

                    {/* New Team Form */}
                    {showNewTeam && (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="p-4 space-y-3">
                                <p className="text-xs font-display uppercase text-primary tracking-widest">Create New Team</p>
                                <Input
                                    placeholder="Team name"
                                    value={newTeamForm.data.name}
                                    onChange={(e) => newTeamForm.setData('name', e.target.value)}
                                    className="bg-surface-container border-transparent"
                                />
                                <Input
                                    placeholder="Player 1 name"
                                    value={newTeamForm.data.player1}
                                    onChange={(e) => newTeamForm.setData('player1', e.target.value)}
                                    className="bg-surface-container border-transparent"
                                />
                                <Input
                                    placeholder="Player 2 name (optional)"
                                    value={newTeamForm.data.player2}
                                    onChange={(e) => newTeamForm.setData('player2', e.target.value)}
                                    className="bg-surface-container border-transparent"
                                />
                                <Button variant="primary" className="w-full" onClick={() => {
                                    // Creates team and refreshes - backend handles player creation
                                    router.post(route('teams.store'), newTeamForm.data, {
                                        onSuccess: () => {
                                            newTeamForm.reset();
                                            setShowNewTeam(false);
                                        },
                                    });
                                }}>
                                    <UserPlus className="h-4 w-4 mr-2" /> Create Team
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search teams..."
                            className="pl-9 bg-surface-container border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {filteredTeams.filter((t) => !registeredTeamIds.includes(t.id)).map((team) => (
                        <Card key={team.id} className="hover:bg-surface-container-high transition-colors">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div>
                                    <div className="font-display text-sm uppercase">{team.name}</div>
                                    {team.players.length > 0 && (
                                        <div className="text-[10px] text-zinc-500 mt-0.5">{team.players.map((p) => p.name).join(', ')}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddTeam(team.id)}
                                    className="h-8 px-3 rounded bg-primary/10 text-primary text-xs font-display hover:bg-primary/20 transition-colors"
                                >
                                    Add
                                </button>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredTeams.filter((t) => !registeredTeamIds.includes(t.id)).length === 0 && (
                        <div className="py-8 text-center">
                            <Users className="h-8 w-8 text-zinc-800 mx-auto mb-2" />
                            <p className="text-xs text-zinc-600">No teams found. Create one above.</p>
                        </div>
                    )}
                </div>

                {/* Generate Brackets CTA */}
                {registeredTeamIds.length >= 2 && (
                    <Button
                        variant="primary"
                        className="w-full h-14 gap-2 text-base"
                        onClick={handleGenerateBrackets}
                    >
                        <ChevronRight className="h-5 w-5" />
                        Generate Brackets ({registeredTeamIds.length} teams)
                    </Button>
                )}
            </div>
        </AppLayout>
    );
}
