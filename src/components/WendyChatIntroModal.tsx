import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Bot } from 'lucide-react';

const STORAGE_KEY = 'wendyIntroSeen';

interface WendyChatIntroModalProps {
  onDismiss?: () => void;
}

export function WendyChatIntroModal({ onDismiss }: WendyChatIntroModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
    onDismiss?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-accent/20">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <AlertDialogTitle className="text-xl">AI Support Tools</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                AI tools in Calm Connection provide supportive suggestions and prompts.
                They are not a replacement for professional care or advice from a qualified health provider.
              </p>
              <p>
                AI responses are generated automatically and may not always be accurate or suitable 
                for every situation. Use your own judgment and seek professional guidance if unsure.
              </p>
              <p>
                AI analysis only occurs with your consent, in line with your Privacy settings.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDismiss} className="w-full">
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
