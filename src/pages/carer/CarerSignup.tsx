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
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { PolicySheet, PolicyType } from '@/components/PolicySheet';

export default function CarerSignup() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<PolicyType | null>(null);
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
        title: 'Oops',
        description: 'Your nickname should be between 3 and 20 characters',
        variant: 'destructive',
      });
      return;
    }
    
    if (!acceptedPrivacy) {
      toast({
        title: 'One more step',
        description: 'Please read and accept the privacy and safeguarding notice to continue',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, 'carer');

      if (error) {
        toast({
          title: 'Oops',
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
          title: 'Oops',
          description: 'Something didn\'t work quite right. Please try logging in.',
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
          title: 'Oops',
          description: 'Something didn\'t work quite right. Please contact support.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'All done! 🎉',
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
        title: 'Oops',
        description: 'Something didn\'t work quite right. Let\'s try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background overflow-y-auto">
        <Card className="relative max-w-md w-full p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 my-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl title-gradient-underline">Carer Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Support your child's emotional journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
            <NicknameExplanation variant="compact" className="mt-2 text-sm" />
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

          <Card className="p-3 sm:p-4 bg-warm/20 border-warm">
            <h3 className="font-bold mb-2 text-sm sm:text-base">Privacy & Safeguarding Notice</h3>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
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

          <div className="flex items-start space-x-2 sm:space-x-3">
            <Checkbox 
              id="privacy" 
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
              className="mt-0.5"
            />
            <label
              htmlFor="privacy"
              className="text-xs sm:text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and accept the{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-sm underline"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenPolicy('privacy');
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
                  setOpenPolicy('terms');
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
                  setOpenPolicy('safeguarding');
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

        {/* Crisis disclaimer before account creation */}
        <div className="mt-4">
          <DisclaimerCard variant="crisis-full" size="small" />
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/role-selection')}
          >
            ← Go back
          </Button>
        </div>

        {/* Policy Sheets */}
        <PolicySheet 
          open={openPolicy === 'privacy'} 
          onOpenChange={(open) => !open && setOpenPolicy(null)} 
          policyType="privacy" 
        />
        <PolicySheet 
          open={openPolicy === 'terms'} 
          onOpenChange={(open) => !open && setOpenPolicy(null)} 
          policyType="terms" 
        />
        <PolicySheet 
          open={openPolicy === 'safeguarding'} 
          onOpenChange={(open) => !open && setOpenPolicy(null)} 
          policyType="safeguarding" 
        />
      </Card>
    </div>
  );
}