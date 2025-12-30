import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { Loader2 } from 'lucide-react';

interface BreathingLoaderProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export function BreathingLoader({ 
  message = 'Getting things ready...', 
  subMessage = 'This might take a moment',
  className 
}: BreathingLoaderProps) {
  const reduceMotion = useReduceMotion();
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (reduceMotion) return;
    
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === 'in' ? 'out' : 'in'));
    }, 4000);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  // Fallback to simple spinner for reduce motion
  if (reduceMotion) {
    return (
      <div className={cn('flex flex-col items-center gap-4 p-6', className)}>
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">{message}</p>
          {subMessage && (
            <p className="text-xs text-muted-foreground">{subMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-6 p-6', className)}>
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl transition-transform duration-[4000ms] ease-in-out',
            breathPhase === 'in' ? 'scale-125' : 'scale-100'
          )}
        />
        
        {/* Main breathing circle */}
        <div 
          className={cn(
            'relative h-24 w-24 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border-2 border-primary/30 transition-transform duration-[4000ms] ease-in-out flex items-center justify-center',
            breathPhase === 'in' ? 'scale-110' : 'scale-90'
          )}
        >
          <div 
            className={cn(
              'h-8 w-8 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 transition-transform duration-[4000ms] ease-in-out',
              breathPhase === 'in' ? 'scale-125' : 'scale-75'
            )}
          />
        </div>
      </div>

      <div className="text-center space-y-1 animate-fade-in">
        <p className="text-sm font-medium text-foreground">{message}</p>
        {subMessage && (
          <p className="text-xs text-muted-foreground">{subMessage}</p>
        )}
      </div>

      {/* Optional breathing hint */}
      <p className="text-xs text-muted-foreground/70 italic">
        {breathPhase === 'in' ? 'Breathe in...' : 'Breathe out...'}
      </p>
    </div>
  );
}
