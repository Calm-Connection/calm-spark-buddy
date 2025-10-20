import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

export default function EnterInviteCode() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find valid invite code
      const { data: inviteData, error: inviteError } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !inviteData) {
        toast({
          title: 'Invalid code',
          description: 'This invite code is not valid or has expired',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Mark code as used
      await supabase
        .from('invite_codes')
        .update({ used: true, child_user_id: user?.id })
        .eq('id', inviteData.id);

      toast({
        title: 'Success! 🎉',
        description: 'You\'re now connected to your carer',
      });

      // Store carer ID for later profile creation
      localStorage.setItem('linkedCarerId', inviteData.carer_user_id);
      navigate('/child/pick-theme');

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold">Enter Invite Code</h1>
          <p className="text-muted-foreground">
            Your parent or carer should have shared a 6-character code with you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="text-center text-2xl font-bold tracking-wider"
              required
            />
            <p className="text-xs text-center text-muted-foreground">
              Enter the 6-character code
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90" 
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking code...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </form>

        <Button 
          variant="ghost" 
          onClick={() => navigate('/child/pick-theme')}
          className="w-full"
        >
          Skip for now
        </Button>
      </Card>
    </div>
  );
}