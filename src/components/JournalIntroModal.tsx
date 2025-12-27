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
import { BookOpen } from 'lucide-react';

const STORAGE_KEY = 'journalIntroSeen';

interface JournalIntroModalProps {
  onDismiss?: () => void;
}

export function JournalIntroModal({ onDismiss }: JournalIntroModalProps) {
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
            <div className="p-2 rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-xl">Your Private Space</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                This journal is a private space for reflection and emotional expression.
                It is not a substitute for professional advice, diagnosis, or treatment.
              </p>
              <p>
                We do not routinely read journal entries. Analysis only occurs if you explicitly 
                opt in to AI insights or sharing features, except where safeguarding concerns 
                require action in line with our Safeguarding Policy.
              </p>
              <p>
                Entries are confidential, but no digital platform can guarantee complete security. 
                Please avoid including highly sensitive personal details such as addresses, 
                phone numbers, or names of others.
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
