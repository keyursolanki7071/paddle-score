import * as React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trophy, Mail, Lock, User, ChevronRight, AlertCircle } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6">
            {/* Brand */}
            <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(117,255,158,0.15)]">
                    <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl uppercase tracking-tight text-white">PaddleScore</h1>
                <p className="text-zinc-500 text-sm mt-1 font-sans">Join the Arena</p>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="bg-surface-container rounded-2xl p-6 space-y-5">
                    <h2 className="font-display uppercase tracking-wide text-lg">Create Account</h2>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Alex Rivera"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="pl-9 bg-surface-container-high border-transparent"
                                />
                            </div>
                            {errors.name && (
                                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                                    <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="pl-9 bg-surface-container-high border-transparent"
                                />
                            </div>
                            {errors.email && (
                                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                                    <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Min. 8 characters"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="pl-9 bg-surface-container-high border-transparent"
                                />
                            </div>
                            {errors.password && (
                                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                                    <AlertCircle className="h-3.5 w-3.5" /> {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-display text-zinc-500 uppercase tracking-[0.2em]">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Repeat password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="pl-9 bg-surface-container-high border-transparent"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-12 gap-2 text-sm"
                            disabled={processing}
                        >
                            {processing ? 'Creating Account...' : (
                                <>Enter the Arena <ChevronRight className="h-4 w-4" /></>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-zinc-600 text-sm mt-5 font-sans">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
