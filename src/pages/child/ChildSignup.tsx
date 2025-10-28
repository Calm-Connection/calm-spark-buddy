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

export default function ChildSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkParent, setLinkParent] = useState<boolean | null>(null);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full p-8 space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Hello! 👋</h1>
            <p className="text-muted-foreground">Do you have a parent or carer who will use this app with you?</p>
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground">Let's get you set up!</p>
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