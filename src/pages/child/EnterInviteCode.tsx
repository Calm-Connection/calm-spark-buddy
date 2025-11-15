import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { DecorativeIcon } from '@/components/DecorativeIcon';

interface ClaimInviteCodeResult {
  success: boolean;
  error?: string;
  message?: string;
  carer_user_id?: string;
}

export default function EnterInviteCode() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedCode = code.trim().toUpperCase();
    
    if (trimmedCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a valid 6-character code',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);

    try {
      // Call the secure server-side function
      const { data, error: claimError } = await supabase
        .rpc('claim_invite_code', { _code: trimmedCode });
      
      const claimResult = data as unknown as ClaimInviteCodeResult;

      if (claimError) {
        console.error('Claim error:', claimError);
        toast({
          title: 'Error',
          description: 'Could not process code. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Handle the response
      if (!claimResult.success) {
        const errorMessages: Record<string, string> = {
          not_authenticated: 'Please log in and try again',
          code_used: 'This code has already been used. Please ask your carer for a new code.',
          code_expired: 'This code has expired. Please ask your carer for a new code.',
          code_not_found: 'This code doesn\'t exist. Please check the code and try again.',
          carer_not_found: 'The carer account hasn\'t completed setup yet. Please ask them to log in and complete their profile.',
        };

        toast({
          title: claimResult.error === 'code_used' ? 'Code already used' : 
                 claimResult.error === 'code_expired' ? 'Code expired' : 'Error',
          description: errorMessages[claimResult.error] || claimResult.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Success! 🎉',
        description: 'You\'re now linked with your carer!',
      });

      // Store carer ID for later profile creation
      localStorage.setItem('linkedCarerId', claimResult.carer_user_id);
      navigate('/child/pick-theme');

    } catch (error) {
      console.error('Error linking accounts:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <Card className="border-0 shadow-soft-lg relative overflow-hidden">
        <DecorativeIcon icon="star" position="top-right" opacity={0.1} />
        <DecorativeIcon icon="cloud" position="bottom-left" opacity={0.08} />
        <CardContent className="space-y-8">
          <div className="text-center space-y-4">
            <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-interactive-accent/10 to-primary/10 flex items-center justify-center shadow-soft">
              <span className="text-5xl">🔐</span>
            </div>
            <h1 className="text-foreground bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ENTER INVITE CODE
            </h1>
            <p className="text-lg text-foreground/70 font-medium">
              Your parent or carer should have shared a 6-character code with you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-center text-3xl font-black tracking-widest"
                required
              />
              <p className="text-sm text-center text-foreground/60">
                Enter the 6-character code
              </p>
            </div>

            <Button 
              type="submit" 
              variant="gradient"
              size="lg"
              className="w-full" 
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking code...
                </>
              ) : (
                'CONNECT'
              )}
            </Button>
          </form>

          <Button 
            variant="peachy" 
            onClick={() => navigate('/child/pick-theme')}
            size="lg"
            className="w-full"
          >
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}