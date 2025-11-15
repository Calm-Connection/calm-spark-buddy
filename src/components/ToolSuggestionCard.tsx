import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WendyAvatar } from '@/components/WendyAvatar';
import { Sparkles } from 'lucide-react';

interface ToolSuggestionCardProps {
  message: string;
  suggestedTools: string[];
  onDismiss: () => void;
  onSelectTool: (tool: string) => void;
}

export function ToolSuggestionCard({ 
  message, 
  suggestedTools,
  onDismiss,
  onSelectTool
}: ToolSuggestionCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 animate-fade-in">
      <div className="flex items-start gap-4">
        <WendyAvatar size="md" />
        <div className="flex-1">
          <p className="text-sm font-medium mb-3">{message}</p>
          {suggestedTools && suggestedTools.length > 0 && (
            <div className="space-y-2">
              {suggestedTools.map((tool: string) => (
                <Button
                  key={tool}
                  onClick={() => onSelectTool(tool)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start hover:bg-primary/5"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {tool}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={onDismiss}
        variant="ghost"
        size="sm"
        className="mt-4 w-full text-muted-foreground hover:text-foreground"
      >
        Maybe later
      </Button>
    </Card>
  );
}
