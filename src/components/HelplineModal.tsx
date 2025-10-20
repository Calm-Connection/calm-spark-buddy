import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Phone, MessageCircle } from 'lucide-react';

interface HelplineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelplineModal({ open, onOpenChange }: HelplineModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">You're not alone 💜</AlertDialogTitle>
          <AlertDialogDescription className="text-base space-y-4">
            <p>It sounds like you might be feeling unsafe or worried. Here are trusted people who can help right now:</p>
            
            <div className="space-y-3 mt-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-bold">Childline UK</span>
                </div>
                <p className="text-sm mb-2">Free, confidential support 24/7</p>
                <a 
                  href="tel:08001111" 
                  className="text-lg font-bold text-primary hover:underline"
                >
                  0800 1111
                </a>
              </div>

              <div className="p-4 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  <span className="font-bold">Online Chat</span>
                </div>
                <p className="text-sm mb-2">Chat with a counselor online</p>
                <a 
                  href="https://www.childline.org.uk/get-support/1-2-1-counsellor-chat/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary hover:underline font-medium"
                >
                  childline.org.uk/chat
                </a>
              </div>

              <div className="p-4 bg-accent/20 rounded-lg">
                <p className="text-sm font-medium">
                  💛 You can also talk to a trusted adult: a parent, teacher, school counselor, or family member
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-primary hover:bg-primary/90">
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}