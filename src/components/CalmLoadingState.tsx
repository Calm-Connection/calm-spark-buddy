import { Loader2 } from 'lucide-react';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { cn } from '@/lib/utils';

interface CalmLoadingStateProps {
  variant?: 'spinner' | 'dots' | 'breathing';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CalmLoadingState({ 
  variant = 'spinner', 
  message,
  size = 'md',
  className 
}: CalmLoadingStateProps) {
  const reduceMotion = useReduceMotion();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const dotSizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full bg-primary/60',
                dotSizeClasses[size],
                !reduceMotion && 'animate-typing-dot'
              )}
              style={{
                animationDelay: reduceMotion ? '0ms' : `${i * 150}ms`,
              }}
            />
          ))}
        </div>
        {message && (
          <p className="text-sm text-muted-foreground animate-fade-in">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'breathing') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div 
          className={cn(
            'rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/20',
            size === 'sm' && 'h-12 w-12',
            size === 'md' && 'h-16 w-16',
            size === 'lg' && 'h-24 w-24',
            !reduceMotion && 'animate-breathe-gentle'
          )}
        />
        {message && (
          <p className="text-sm text-muted-foreground text-center animate-fade-in">{message}</p>
        )}
      </div>
    );
  }

  // Default: spinner
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <Loader2 
        className={cn(
          sizeClasses[size],
          'text-primary',
          !reduceMotion && 'animate-spin'
        )} 
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-fade-in">{message}</p>
      )}
    </div>
  );
}
