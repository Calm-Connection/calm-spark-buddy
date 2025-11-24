import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { applyTheme } from '@/hooks/useTheme';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { useContentModeration } from '@/hooks/useContentModeration';
import { logConsent } from '@/lib/consentLogger';
import { NicknameExplanation } from '@/components/NicknameExplanation';

export default function ChildSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkParent, setLinkParent] = useState<boolean | null>(null);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { moderateContent } = useContentModeration();

  useEffect(() => {
    applyTheme('classic');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname.length < 3 || nickname.length > 20) {
      toast({
        title: 'Invalid nickname',
        description: 'Nickname must be between 3 and 20 characters',
        variant: 'destructive',
      });
      return;
    }

    // Validate nickname doesn't contain real names
    const moderationResult = await moderateContent(nickname, 'child_nickname');
    if (!moderationResult.safe) {
      toast({
        title: 'Nickname not allowed',
        description: 'Please choose a nickname that doesn\'t include real names. Try something creative like "StarGazer" or "CozyCloud"!',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, 'child');

    if (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      // Log GDPR consent
      await logConsent('privacy_policy', 'granted', {
        signup_type: 'child',
        linked_parent: linkParent
      });
      await logConsent('terms_of_use', 'granted', {
        signup_type: 'child',
        linked_parent: linkParent
      });
      await logConsent('data_processing', 'granted', {
        signup_type: 'child',
        linked_parent: linkParent
      });

      // Store nickname for later
      localStorage.setItem('pendingNickname', nickname);
      
      if (linkParent) {
        navigate('/child/enter-invite-code');
      } else {
        navigate('/child/pick-theme');
      }
    }
  };

  if (linkParent === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/5 via-accent/5 to-background">
        <Card className="max-w-md w-full p-8 space-y-6 shadow-soft-lg border-interactive-accent/20 relative overflow-hidden">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Hello! 👋</h1>
            <p className="text-muted-foreground font-medium">Do you have a parent or carer who will use this app with you?</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setLinkParent(true)}
              className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
            >
              Yes, I have an invite code
            </Button>
            <Button 
              onClick={() => setLinkParent(false)}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              No, I'll use it on my own
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can always link with a parent later if you change your mind
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/5 via-accent/5 to-background">
      <Card className="max-w-md w-full p-8 space-y-6 shadow-soft-lg border-interactive-accent/20 relative overflow-hidden">
        <DecorativeIcon icon="star" position="top-right" opacity={0.1} />
        <DecorativeIcon icon="flower" position="bottom-left" opacity={0.08} />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Create Your Account</h1>
          <p className="text-muted-foreground font-medium">Let's get you set up!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Your Nickname</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="What should we call you?"
              required
              minLength={3}
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">3-20 characters</p>
            <NicknameExplanation variant="compact" className="mt-3" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>

        <DisclaimerCard variant="privacy-sharing" size="small" className="mt-4" />

        <Button 
          variant="ghost" 
          onClick={() => setLinkParent(null)}
          className="w-full"
        >
          ← Go back
        </Button>
      </Card>
    </div>
  );
}