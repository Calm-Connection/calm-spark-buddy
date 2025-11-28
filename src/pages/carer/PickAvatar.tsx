import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const carerAvatarObjects = [
  { id: 'teddyBear', emoji: '🧸', label: 'Teddy Bear' },
  { id: 'toyCar', emoji: '🚗', label: 'Toy Car' },
  { id: 'starCharacter', emoji: '⭐', label: 'Star' },
  { id: 'cloudCreature', emoji: '☁️', label: 'Cloud' },
  { id: 'softAnimal', emoji: '🐰', label: 'Bunny' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'tree', emoji: '🌳', label: 'Tree' },
  { id: 'sun', emoji: '☀️', label: 'Sun' },
];

export default function PickAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState<typeof carerAvatarObjects[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!selectedAvatar) return;

    setLoading(true);

    try {
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

      const avatarData = { 
        type: 'emoji_avatar',
        emoji: selectedAvatar.emoji,
        label: selectedAvatar.label
      };

      const { error } = await supabase
        .from('carer_profiles')
        .update({ avatar_json: avatarData })
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

      // Save to avatar history
      await supabase
        .from('avatar_history')
        .insert({
          user_id: user.id,
          avatar_json: avatarData,
          is_current: true
        });

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background overflow-y-auto">
      <Card className="relative max-w-2xl w-full p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 my-8 overflow-x-hidden">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
        
        {!selectedAvatar ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold">Choose Your Avatar</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Pick an avatar to represent you
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {carerAvatarObjects.map((avatar) => (
                <Button
                  key={avatar.id}
                  variant="outline"
                  onClick={() => setSelectedAvatar(avatar)}
                  className="h-24 sm:h-28 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-3xl sm:text-4xl">{avatar.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium">{avatar.label}</span>
                </Button>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/role-selection')}
                className="mt-2"
              >
                ← Go back
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Perfect Choice!</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Here's your avatar</p>
            </div>

            <Card className="p-6 sm:p-8 flex items-center justify-center bg-primary/5 border-primary/20">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-background flex items-center justify-center text-6xl sm:text-7xl shadow-lg">
                  {selectedAvatar.emoji}
                </div>
                <p className="text-base sm:text-lg font-medium">{selectedAvatar.label}</p>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => setSelectedAvatar(null)}
                variant="outline"
                className="flex-1"
              >
                Choose Different
              </Button>
              <Button 
                onClick={handleContinue}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Use This Avatar'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
