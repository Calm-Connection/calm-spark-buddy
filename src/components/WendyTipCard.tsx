import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WendyAvatar } from '@/components/WendyAvatar';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { Sparkles, Heart, Wind, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WendyTipCardProps {
  tip: string;
  actionType?: 'tool' | 'module' | 'suggestion';
  actionLink?: string;
  actionLabel?: string;
}

export function WendyTipCard({ tip, actionType, actionLink, actionLabel }: WendyTipCardProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (actionType) {
      case 'tool':
        return <Wind className="h-5 w-5 text-primary" />;
      case 'module':
        return <BookOpen className="h-5 w-5 text-primary" />;
      default:
        return <Heart className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="relative p-5 border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
      
      <div className="flex items-start gap-3">
        <WendyAvatar size="lg" />
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-lg">Wendy's Tip for You 💜</h3>
          <p className="text-sm font-medium">{tip}</p>
          {actionLink && actionLabel && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate(actionLink)}
            >
              {getIcon()}
              <span className="ml-2">{actionLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
