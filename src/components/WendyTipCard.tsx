import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <div className="flex items-start gap-3">
        <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-lg">Wendy's Tip for You 💜</h3>
          <p className="text-sm">{tip}</p>
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
