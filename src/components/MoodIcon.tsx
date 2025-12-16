import { getEmotionalIcon } from '@/constants/emotionalIcons';
import { cn } from '@/lib/utils';

interface MoodIconProps {
  moodId: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  className?: string;
}

export function MoodIcon({ moodId, size = 'md', selected = false, className }: MoodIconProps) {
  const emotionalIcon = getEmotionalIcon(moodId);
  
  if (!emotionalIcon) return null;
  
  const Icon = emotionalIcon.icon;
  
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };
  
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };
  
  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200',
        sizeClasses[size],
        selected && 'scale-110 ring-2 ring-primary',
        className
      )}
      style={{ backgroundColor: emotionalIcon.color }}
    >
      {/* High contrast icon - white/dark text depending on background brightness */}
      <Icon className={cn(iconSizes[size], 'text-foreground drop-shadow-sm')} style={{ filter: 'contrast(1.2)' }} />
    </div>
  );
}
