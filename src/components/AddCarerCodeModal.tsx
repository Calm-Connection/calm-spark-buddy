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

      // Get current child profile
      const { data: childProfile, error: profileError } = await supabase
        .from('children_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profileError || !childProfile) {
        toast({
          title: 'Error',
          description: 'Could not find your profile',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Mark code as used and link accounts
      const { error: updateCodeError } = await supabase
        .from('invite_codes')
        .update({ used: true, child_user_id: user?.id })
        .eq('id', inviteData.id);

      if (updateCodeError) {
        toast({
          title: 'Error',
          description: 'Could not link accounts',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Update child profile with linked carer
      const { error: updateProfileError } = await supabase
        .from('children_profiles')
        .update({ linked_carer_id: inviteData.carer_user_id })
        .eq('id', childProfile.id);

      if (updateProfileError) {
        toast({
          title: 'Error',
          description: 'Could not update profile',
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
