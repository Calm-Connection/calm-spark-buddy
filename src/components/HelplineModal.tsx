import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

interface HelplineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childProfileId?: string;
  triggeredBy?: 'journal_entry' | 'manual' | 'tool_usage';
}

export function HelplineModal({ open, onOpenChange, childProfileId, triggeredBy = 'manual' }: HelplineModalProps) {
  const [engagementType, setEngagementType] = useState<'none' | 'called' | 'chatted' | 'trusted_adult' | 'dismissed'>('none');

  const handleEngagement = async (type: 'called' | 'chatted' | 'trusted_adult' | 'dismissed') => {
    setEngagementType(type);
    
    // Log engagement to database if childProfileId is provided
    if (childProfileId) {
      try {
        await supabase.from('helpline_engagements').insert([{
          child_id: childProfileId,
          engagement_type: type,
          triggered_by: triggeredBy,
        }]);
      } catch (error) {
        console.error('Error logging helpline engagement:', error);
      }
    }
    
    // Show appropriate feedback
    if (type === 'called') {
      toast.success('That\'s really brave 💜', {
        description: 'Talking to someone when you need help is a sign of strength.',
      });
    } else if (type === 'chatted') {
      toast.success('Great choice 💙', {
        description: 'Online chat can be a comfortable way to open up.',
      });
    } else if (type === 'trusted_adult') {
      toast.success('Well done 🌟', {
        description: 'Having someone you trust to talk to is wonderful.',
      });
    }
    
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">You're not alone 💜</AlertDialogTitle>
          <AlertDialogDescription className="text-base space-y-4">
            <p>It sounds like things might be feeling hard right now. Here are trusted people who can listen:</p>
            
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
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => handleEngagement('called')}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            <Phone className="mr-2 h-4 w-4" />
            I called Childline
          </Button>
          
          <Button 
            onClick={() => handleEngagement('chatted')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            I used online chat
          </Button>
          
          <Button 
            onClick={() => handleEngagement('trusted_adult')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Heart className="mr-2 h-4 w-4" />
            I talked to someone I trust
          </Button>
          
          <Button 
            onClick={() => handleEngagement('dismissed')}
            variant="ghost"
            className="text-muted-foreground w-full sm:w-auto"
          >
            Not right now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
