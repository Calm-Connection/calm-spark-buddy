import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  earned?: boolean;
  progress?: number;
  requirementCount?: number;
  className?: string;
}

export function AchievementBadge({
  icon,
  name,
  description,
  earned = false,
  progress = 0,
  requirementCount = 1,
  className,
}: AchievementBadgeProps) {
  return (
    <Card
      className={cn(
        'p-4 transition-all',
        earned
          ? 'bg-gradient-to-br from-accent/30 to-primary/20 border-primary/30'
          : 'bg-muted/50 opacity-60',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'text-4xl',
          !earned && 'grayscale opacity-50'
        )}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold">{name}</h3>
            {earned && <Badge variant="secondary">Earned!</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          {!earned && requirementCount > 1 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress} / {requirementCount}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(progress / requirementCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
