import { Card, CardSection } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ConversationStartersCardProps {
  starters: string[];
  themes: string[];
}

export function ConversationStartersCard({ starters, themes }: ConversationStartersCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="relative">
      <DecorativeIcon icon="cloud" position="top-right" opacity={0.08} />
      
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        Gentle Conversation Starters
      </h3>

      <p className="text-muted-foreground mb-6">
        Based on recent entries, here are some caring ways to open up a conversation:
      </p>

      <div className="space-y-3">
        {starters.map((starter, idx) => (
          <CardSection key={idx} className="group hover:bg-primary/5 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{starter}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={() => handleCopy(starter, idx)}
              >
                {copiedIndex === idx ? (
                  <Check className="h-4 w-4 text-interactive-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardSection>
        ))}
      </div>

      <div className="mt-6 p-4 bg-interactive-accent/10 rounded-xl">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Choose a calm, comfortable moment. Let them know you're here to listen, not to judge or fix.
        </p>
      </div>
    </Card>
  );
}
