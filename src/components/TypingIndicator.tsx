import { cn } from '@/lib/utils';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { WendyAvatar } from '@/components/WendyAvatar';

interface TypingIndicatorProps {
  showAvatar?: boolean;
  className?: string;
}

export function TypingIndicator({ showAvatar = true, className }: TypingIndicatorProps) {
  const reduceMotion = useReduceMotion();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showAvatar && <WendyAvatar size="sm" />}
      <div className="bg-muted/50 rounded-2xl px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'h-2 w-2 rounded-full bg-primary/50',
              !reduceMotion && 'animate-typing-dot'
            )}
            style={{
              animationDelay: reduceMotion ? '0ms' : `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
