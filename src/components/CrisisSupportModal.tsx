import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CrisisSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerReason?: 'button' | 'keywords' | 'manual';
}

export function CrisisSupportModal({ open, onOpenChange, triggerReason = 'manual' }: CrisisSupportModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleClose = () => {
    if (acknowledged) {
      onOpenChange(false);
      setAcknowledged(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            <AlertCircle className="h-8 w-8 text-destructive" />
            You're Not Alone - Help is Available
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {triggerReason === 'keywords' && (
              <div className="bg-destructive/10 p-4 rounded-lg mb-4 text-destructive-foreground">
                <strong>We're concerned about what you shared.</strong>
                <p className="mt-2">If you're thinking about harming yourself or feeling in crisis, please reach out for immediate support.</p>
              </div>
            )}
            {triggerReason === 'button' && (
              <p className="text-muted-foreground">
                It takes courage to ask for help. Below are trusted services available 24/7 to support you.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 my-4">
          {/* Emergency Services */}
          <Card className="border-destructive border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">🚨 Immediate Danger</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you or someone else is in immediate danger of harm, call emergency services right now.
                  </p>
                  <a
                    href="tel:999"
                    className="inline-flex items-center justify-center px-6 py-3 bg-destructive text-destructive-foreground font-bold rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    Call 999 (Emergency)
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Childline */}
          <Card className="border-primary border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Childline 💙</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Free, confidential support for anyone under 19. Talk about anything - call, chat online, or send an email.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="tel:08001111"
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call 0800 1111
                    </a>
                    <a
                      href="https://www.childline.org.uk/get-support/1-2-1-counsellor-chat/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Online Chat
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shout */}
          <Card className="border-secondary border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Shout 💬</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Free 24/7 text support for anyone in crisis. Text anonymously from any phone.
                  </p>
                  <a
                    href="sms:85258?body=SHOUT"
                    className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Text SHOUT to 85258
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Samaritans */}
          <Card className="border-accent border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Samaritans 💚</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    24/7 listening service for anyone who needs to talk. Free to call from any phone.
                  </p>
                  <a
                    href="tel:116123"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call 116 123 (Free)
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Talk to Trusted Adult */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">🤗 Talk to Someone You Trust</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Your parent, carer, or guardian</li>
                <li>A teacher or school counselor</li>
                <li>A family member you feel safe with</li>
                <li>Your GP or doctor</li>
                <li>Youth worker or sports coach</li>
              </ul>
              <p className="text-sm mt-3 font-medium">
                Telling someone you trust is often the first step to feeling better.
              </p>
            </CardContent>
          </Card>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-start gap-2 text-sm text-muted-foreground flex-1">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Important:</strong> Calm Connection cannot respond to emergencies. Please use the services above for immediate help.
            </p>
          </div>
          <Button
            onClick={() => setAcknowledged(true)}
            variant={acknowledged ? 'default' : 'outline'}
            className="w-full sm:w-auto"
            disabled={!acknowledged}
          >
            {acknowledged ? 'Close' : 'I Understand'}
          </Button>
          {acknowledged && (
            <Button onClick={handleClose} variant="default" className="w-full sm:w-auto">
              Close
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
