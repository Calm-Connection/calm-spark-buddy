import { Card } from '@/components/ui/card';
import { WendyAvatar } from '@/components/WendyAvatar';
import { Sparkles } from 'lucide-react';

export function WendyExplanationCard() {
  return (
    <Card className="relative p-4 sm:p-5 border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
      {/* Decorative sparkle */}
      <Sparkles className="absolute top-3 right-3 h-5 w-5 text-primary/15" />
      
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <WendyAvatar size="lg" className="flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            How Wendy Helps
            <span aria-hidden="true">💜</span>
          </h3>
          <div className="text-sm text-foreground/80 space-y-2">
            <p>
              Wendy reads your journal entries to offer gentle support and ideas that might help.
            </p>
            <p>
              What you write is private, unless you choose to share it with your grown-up.
            </p>
            <p>
              If something sounds really worrying, your grown-up may be gently told so they can help keep you safe.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
