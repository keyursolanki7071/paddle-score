import * as React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Trophy, Bell, User, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { url } = usePage();

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), icon: Home },
        { name: 'Tournaments', href: route('tournaments.index'), icon: Trophy },
        { name: 'Alerts', icon: Bell }, // Mocked for now
        { name: 'Profile', href: route('profile'), icon: User },
    ];


    return (
        <div className="flex min-h-screen flex-col bg-background text-zinc-100 selection:bg-primary selection:text-black">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-black">
                            <Trophy className="h-5 w-5" />
                        </div>
                        <h1 className="text-xl font-display uppercase tracking-tight">
                            {title || 'PaddleScore'}
                        </h1>
                    </div>
                    <button className="rounded-full p-2 hover:bg-surface-container-high transition-colors text-zinc-400">
                        <LayoutGrid className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-24 h-full container mx-auto">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 border-t border-white/5 bg-surface/95 backdrop-blur-xl">
                <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === url;

                        const content = (
                            <>
                                <Icon className={cn(
                                    "h-6 w-6 transition-transform",
                                    isActive ? "text-primary scale-110" : "text-zinc-500"
                                )} />
                                <span className={cn(
                                    "text-[10px] uppercase font-display tracking-widest mt-1",
                                    isActive ? "text-primary font-bold" : "text-zinc-500"
                                )}>
                                    {item.name}
                                </span>
                            </>
                        );

                        if (item.href) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors group"
                                >
                                    {content}
                                    {isActive && (
                                        <div className="absolute top-0 h-0.5 w-8 bg-primary rounded-full" />
                                    )}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={item.name}
                                className="inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors"
                                onClick={() => alert(`${item.name} feature coming soon!`)}
                            >
                                {content}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
