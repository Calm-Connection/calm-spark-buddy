import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { applyTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { logConsent } from '@/lib/consentLogger';
import { NicknameExplanation } from '@/components/NicknameExplanation';

export default function CarerSignup() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
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
        description: 'Your nickname should be between 3 and 20 characters',
        variant: 'destructive',
      });
      return;
    }
    
    if (!acceptedPrivacy) {
      toast({
        title: 'Privacy notice required',
        description: 'Please read and accept the privacy and safeguarding notice',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, 'carer');

      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Get the newly created user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'Could not create your profile. Please try logging in.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Create carer profile immediately with nickname
      const { error: profileError } = await supabase
        .from('carer_profiles')
        .insert({
          user_id: user.id,
          nickname: nickname,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: 'Error',
          description: 'Failed to create your profile. Please contact support.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Account created! 🎉',
        description: 'Now let\'s pick your avatar',
      });

      // Log GDPR consent
      await logConsent('privacy_policy', 'granted', {
        signup_type: 'carer'
      });
      await logConsent('terms_of_use', 'granted', {
        signup_type: 'carer'
      });
      await logConsent('data_processing', 'granted', {
        signup_type: 'carer'
      });

      navigate('/carer/pick-avatar');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background overflow-y-auto">
        <Card className="relative max-w-md w-full p-8 space-y-6 my-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-interactive-accent to-primary bg-clip-text text-transparent">Carer Account</h1>
          <p className="text-muted-foreground">Support your child's emotional journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="How you'd like to be called"
              required
              minLength={3}
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">Between 3 and 20 characters</p>
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

          <Card className="p-4 bg-warm/20 border-warm">
            <h3 className="font-bold mb-2">Privacy & Safeguarding Notice</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Your child's journal entries are private by default
              </p>
              <p>
                • You'll only see entries your child chooses to share
              </p>
              <p>
                • Wendy AI provides gentle insights to support your child
              </p>
              <p>
                • If high-risk content is detected, appropriate safeguarding measures will be triggered
              </p>
              <p>
                • All data is encrypted and handled according to UK safeguarding regulations
              </p>
            </div>
          </Card>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy" 
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
            />
            <label
              htmlFor="privacy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and accept the{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-sm underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/carer/privacy-policy', '_blank');
                }}
              >
                Privacy Policy
              </Button>
              ,{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-sm underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/carer/terms-of-use', '_blank');
                }}
              >
                Terms of Use
              </Button>
              , and{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-sm underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/carer/safeguarding-info', '_blank');
                }}
              >
                Safeguarding Policy
              </Button>
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={loading || !acceptedPrivacy}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/role-selection')}
          >
            ← Go back
          </Button>
        </div>
      </Card>
    </div>
  );
}