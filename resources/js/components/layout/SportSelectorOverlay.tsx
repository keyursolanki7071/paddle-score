import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Trophy, Target, Zap } from 'lucide-react';

interface SportSelectorOverlayProps {
    onSelect: (sport: 'pickleball' | 'padel') => void;
    currentSport?: 'pickleball' | 'padel';
}

export function SportSelectorOverlay({ onSelect, currentSport }: SportSelectorOverlayProps) {
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-sm font-display text-zinc-500 uppercase tracking-widest px-1">Select Arena</h2>
            
            <div className="grid grid-cols-1 gap-4">
                <Card 
                    className={cn(
                        "relative overflow-hidden group cursor-pointer transition-all border-2",
                        currentSport === 'pickleball' 
                            ? "border-primary bg-primary/5" 
                            : "border-transparent hover:border-white/10"
                    )}
                    onClick={() => onSelect('pickleball')}
                >
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-12 w-12 rounded-lg flex items-center justify-center transition-colors",
                                currentSport === 'pickleball' ? "bg-primary text-black" : "bg-zinc-800 text-primary"
                            )}>
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-display text-lg">Pickleball</h3>
                                <p className="text-xs text-zinc-400 font-sans">Fast-paced, tactical rally</p>
                            </div>
                        </div>
                        {currentSport === 'pickleball' && (
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        )}
                    </div>
                </Card>

                <Card 
                    className={cn(
                        "relative overflow-hidden group cursor-pointer transition-all border-2",
                        currentSport === 'padel' 
                            ? "border-secondary bg-secondary/5" 
                            : "border-transparent hover:border-white/10"
                    )}
                    onClick={() => onSelect('padel')}
                >
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-12 w-12 rounded-lg flex items-center justify-center transition-colors",
                                currentSport === 'padel' ? "bg-secondary text-black" : "bg-zinc-800 text-secondary"
                            )}>
                                <Target className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-display text-lg">Padel</h3>
                                <p className="text-xs text-zinc-400 font-sans">Power & geometry on glass</p>
                            </div>
                        </div>
                        {currentSport === 'padel' && (
                            <div className="h-2 w-2 rounded-full bg-secondary animate-ping" />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
