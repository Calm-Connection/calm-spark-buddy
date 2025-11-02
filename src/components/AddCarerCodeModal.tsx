import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface AddCarerCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddCarerCodeModal({ open, onOpenChange, onSuccess }: AddCarerCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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
        .maybeSingle();

      if (inviteError) {
        console.error('Invite code fetch error:', inviteError);
        toast({
          title: 'Error',
          description: 'Could not verify code. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (!inviteData) {
        // Check if code exists but is used or expired
        const { data: usedCode } = await supabase
          .from('invite_codes')
          .select('*')
          .eq('code', trimmedCode)
          .maybeSingle();

        if (usedCode?.used) {
          toast({
            title: 'Code already used',
            description: 'This code has already been used. Please ask your carer for a new code.',
            variant: 'destructive',
          });
        } else if (usedCode && new Date(usedCode.expires_at) < new Date()) {
          toast({
            title: 'Code expired',
            description: 'This code has expired. Please ask your carer for a new code.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Code not found',
            description: 'This code doesn\'t exist. Please check the code and try again.',
            variant: 'destructive',
          });
        }
        setLoading(false);
        return;
      }

      // Verify carer profile exists
      const { data: carerProfile, error: carerError } = await supabase
        .from('carer_profiles')
        .select('id')
        .eq('user_id', inviteData.carer_user_id)
        .maybeSingle();

      if (carerError || !carerProfile) {
        console.error('Carer profile check error:', carerError);
        toast({
          title: 'Unable to verify carer',
          description: 'The carer account hasn\'t completed setup yet. Please ask them to log in and complete their profile.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Get current child profile
      const { data: childProfile, error: profileError } = await supabase
        .from('children_profiles')
        .select('id, user_id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: 'Error',
          description: 'Could not access your profile. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (!childProfile) {
        toast({
          title: 'Error',
          description: 'Please complete your profile setup first.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Verify user is authenticated
      if (!user?.id) {
        toast({
          title: 'Authentication Error',
          description: 'Please refresh the page and try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Mark code as used (update by code to use RLS policy)
      const { error: updateCodeError } = await supabase
        .from('invite_codes')
        .update({ used: true, child_user_id: user?.id })
        .eq('code', trimmedCode)
        .eq('used', false);

      if (updateCodeError) {
        console.error('Code update error:', updateCodeError);
        toast({
          title: 'Error',
          description: 'Could not mark code as used. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Update child profile with linked carer (update by user_id for RLS)
      const { error: updateProfileError } = await supabase
        .from('children_profiles')
        .update({ linked_carer_id: inviteData.carer_user_id })
        .eq('user_id', user?.id);

      if (updateProfileError) {
        console.error('Profile update error:', updateProfileError);
        toast({
          title: 'Error',
          description: 'Could not update your profile. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Success! 🎉',
        description: 'You\'re now linked with your carer!',
      });

      setCode('');
      onOpenChange(false);
      onSuccess?.();

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Add Carer Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <span className="text-3xl">🔐</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the 6-character code your carer shared with you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="text-center text-2xl font-black tracking-widest"
              required
            />

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="gradient"
                className="flex-1" 
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Linking...
                  </>
                ) : (
                  'Link Account'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
