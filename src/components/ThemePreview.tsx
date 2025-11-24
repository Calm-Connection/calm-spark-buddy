import { cn } from '@/lib/utils';

interface ThemePreviewProps {
  theme: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  emoji: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ThemePreview({ theme, emoji, size = 'md', className }: ThemePreviewProps) {
  const height = size === 'sm' ? 'h-20' : 'h-24';
  const cardSize = size === 'sm' ? 'h-8 w-16' : 'h-10 w-20';
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';

  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden border-2 border-border/20",
        height,
        className
      )}
      style={{ backgroundColor: `hsl(${theme.background})` }}
    >
      {/* Mini card element showing primary color */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-sm",
          cardSize
        )}
        style={{ backgroundColor: `hsl(${theme.primary})` }}
      />
      
      {/* Decorative dots in secondary and accent colors */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        <div 
          className={cn("rounded-full", dotSize)}
          style={{ backgroundColor: `hsl(${theme.secondary})` }}
        />
        <div 
          className={cn("rounded-full", dotSize)}
          style={{ backgroundColor: `hsl(${theme.accent})` }}
        />
        <div 
          className={cn("rounded-full", dotSize)}
          style={{ backgroundColor: `hsl(${theme.primary})` }}
        />
      </div>

      {/* Emoji decoration */}
      <div className="absolute top-1 right-1 text-xs opacity-60">
        {emoji}
      </div>
    </div>
  );
}
