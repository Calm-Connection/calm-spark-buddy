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
      // Find valid invite code
      const { data: inviteData, error: inviteError } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', trimmedCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !inviteData) {
        toast({
          title: 'Code not found',
          description: 'That code isn\'t valid or has expired. Please check and try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Mark code as used
      const { error: updateError } = await supabase
        .from('invite_codes')
        .update({ used: true, child_user_id: user?.id })
        .eq('id', inviteData.id);

      if (updateError) {
        toast({
          title: 'Error',
          description: 'Could not link accounts. Please try again.',
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
      localStorage.setItem('linkedCarerId', inviteData.carer_user_id);
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
      <Card className="border-0">
        <CardContent className="space-y-8">
          <div className="text-center space-y-4">
            <div className="h-24 w-24 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <span className="text-5xl">🔐</span>
            </div>
            <h1 className="text-foreground">ENTER INVITE CODE</h1>
            <p className="text-lg text-foreground/70">
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