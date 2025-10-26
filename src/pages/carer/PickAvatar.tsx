import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const avatars = [
  { id: 'avatar1', emoji: '👨', label: 'Person 1' },
  { id: 'avatar2', emoji: '👩', label: 'Person 2' },
  { id: 'avatar3', emoji: '👴', label: 'Person 3' },
  { id: 'avatar4', emoji: '👵', label: 'Person 4' },
  { id: 'avatar5', emoji: '🧑', label: 'Person 5' },
  { id: 'avatar6', emoji: '👱', label: 'Person 6' },
];

export default function PickAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!selectedAvatar) return;

    setLoading(true);

    try {
      const avatar = avatars.find(a => a.id === selectedAvatar);
      if (!avatar) {
        toast({
          title: 'Error',
          description: 'Please select an avatar',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to continue',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Update carer profile with avatar in database
      const { error } = await supabase
        .from('carer_profiles')
        .update({ avatar_json: { emoji: avatar.emoji } })
        .eq('user_id', user.id);

      if (error) {
        console.error('Avatar update error:', error);
        toast({
          title: 'Error',
          description: 'Failed to save avatar. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Avatar saved! ✨',
        description: 'Let\'s continue with the tour',
      });

      navigate('/quick-tour');
    } catch (error) {
      console.error('Error saving avatar:', error);
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
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Avatar</h1>
          <p className="text-muted-foreground">
            Pick an avatar that represents you
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <Card
              key={avatar.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedAvatar === avatar.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-6xl">{avatar.emoji}</div>
                {selectedAvatar === avatar.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={!selectedAvatar || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </Card>
    </div>
  );
}