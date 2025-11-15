import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { WendyAvatar } from '@/components/WendyAvatar';

interface CheckInPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onShare: () => void;
}

export function CheckInPromptModal({ 
  open, 
  onOpenChange, 
  message,
  onShare
}: CheckInPromptModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4">
            <WendyAvatar size="lg" />
          </div>
          <AlertDialogTitle className="text-xl text-center">
            I'm here for you 💜
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-center leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2">
          <Button 
            onClick={() => {
              onShare();
              onOpenChange(false);
            }}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Yes, share with my grown-up
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
          >
            Not right now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
