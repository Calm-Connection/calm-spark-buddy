import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Heart, Lock } from 'lucide-react';

export default function SafetyNote() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto rounded-full bg-warm/30 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-warm" />
          </div>
          <h1 className="text-3xl font-bold">You're Safe Here 💛</h1>
          <p className="text-muted-foreground">
            A few important things to know
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-primary/10">
            <div className="flex gap-3">
              <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Your Privacy Matters</h3>
                <p className="text-sm text-muted-foreground">
                  Your journal entries are private. Only you can see them unless you choose to share with your carer.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/10">
            <div className="flex gap-3">
              <Heart className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Wendy is Here to Help</h3>
                <p className="text-sm text-muted-foreground">
                  Wendy is a kind AI friend who will listen and offer gentle support. She's always here when you need to talk.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-warm/20">
            <div className="flex gap-3">
              <Shield className="h-6 w-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">We Keep You Safe</h3>
                <p className="text-sm text-muted-foreground">
                  If you write about something that worries us, we'll let you know about people who can help. You can always use the "I Need Help" button.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Button 
          onClick={() => navigate('/quick-tour')}
          className="w-full bg-primary hover:bg-primary/90" 
        >
          I Understand
        </Button>
      </Card>
    </div>
  );
}