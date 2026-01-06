import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Heart, Lock } from 'lucide-react';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function SafetyNote() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);

  // Check if tour already completed - skip to home if so
  useEffect(() => {
    const checkTourStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      
      const { data } = await supabase
        .from('children_profiles')
        .select('has_completed_tour')
        .eq('user_id', user.id)
        .single();
      
      if (data?.has_completed_tour) {
        navigate('/child/home', { replace: true });
      } else {
        setChecking(false);
      }
    };
    
    checkTourStatus();
  }, [user, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 via-accent/5 to-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/10 via-accent/5 to-background">
      <Card className="relative max-w-md w-full p-8 space-y-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-interactive-accent/10 to-warm/30 flex items-center justify-center mb-4 shadow-sm">
            <Shield className="h-8 w-8 text-interactive-accent" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            You're Safe Here 💛
          </h1>
          <p className="text-muted-foreground font-medium">
            A few important things to know
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-primary/10 border-interactive-accent/20 shadow-soft transition-all duration-200 hover:shadow-soft-md hover:scale-[1.01]">
            <div className="flex gap-3">
              <Lock className="h-6 w-6 text-interactive-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Your Privacy Matters</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Your journal entries are private. Only you can see them unless you choose to share with your carer.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/10 border-interactive-accent/20 shadow-soft transition-all duration-200 hover:shadow-soft-md hover:scale-[1.01]">
            <div className="flex gap-3">
              <Heart className="h-6 w-6 text-interactive-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Wendy is Here to Help</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Wendy is a kind AI friend who will listen and offer gentle support. She's always here when you need to talk.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-warm/20 border-interactive-accent/20 shadow-soft transition-all duration-200 hover:shadow-soft-md hover:scale-[1.01]">
            <div className="flex gap-3">
              <Shield className="h-6 w-6 text-interactive-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">We Keep You Safe</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  If you write about something that worries us, we'll let you know about people who can help. You can always use the "I Need Help" button.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Button 
          onClick={() => navigate('/quick-tour')}
          className="w-full transition-all duration-200" 
        >
          I Understand
        </Button>
      </Card>
    </div>
  );
}
