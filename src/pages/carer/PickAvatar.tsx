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
  { id: 'balloon', emoji: '🎈', label: 'Balloon' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'sunflower', emoji: '🌻', label: 'Sunflower' },
  { id: 'apple', emoji: '🍎', label: 'Apple' },
  { id: 'palette', emoji: '🎨', label: 'Palette' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'books', emoji: '📚', label: 'Books' },
  { id: 'puzzle', emoji: '🧩', label: 'Puzzle' },
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

  // Single-tap save function
  const handleSingleTapSelect = async (avatar: typeof carerAvatarObjects[0]) => {
    setSelectedAvatar(avatar);
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
        setSelectedAvatar(null);
        return;
      }

      const avatarData = { 
        type: 'emoji_avatar',
        emoji: avatar.emoji,
        label: avatar.label
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
        setSelectedAvatar(null);
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
      setSelectedAvatar(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background overflow-y-auto">
      <Card className="relative max-w-2xl w-full p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 my-8 overflow-x-hidden">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Choose Your Avatar</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Tap an avatar to select and continue
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
          {carerAvatarObjects.map((avatar) => (
            <Button
              key={avatar.id}
              variant="outline"
              onClick={() => handleSingleTapSelect(avatar)}
              disabled={loading}
              className={`h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 hover:border-primary hover:bg-primary/5 transition-all ${
                selectedAvatar?.id === avatar.id ? 'border-primary bg-primary/10 ring-2 ring-primary' : ''
              }`}
            >
              {loading && selectedAvatar?.id === avatar.id ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl">{avatar.emoji}</span>
                  <span className="text-xs font-medium truncate w-full text-center">{avatar.label}</span>
                </>
              )}
            </Button>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/role-selection')}
            className="mt-2"
            disabled={loading}
          >
            ← Go back
          </Button>
        </div>
      </Card>
    </div>
  );
}
