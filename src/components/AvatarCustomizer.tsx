import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ObjectAvatarBuilder } from '@/components/children/ObjectAvatarBuilder';

interface AvatarCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: any;
  onAvatarUpdate: (avatar: any) => void;
  context?: 'onboarding' | 'settings';
}

export function AvatarCustomizer({ open, onOpenChange, currentAvatar, onAvatarUpdate, context = 'settings' }: AvatarCustomizerProps) {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Object-based avatars for carers (matching PickAvatar)
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

  const updateAvatarHistory = async (avatarData: any) => {
    if (!user) return;
    try {
      const { data: existingAvatars } = await supabase
        .from('avatar_history')
        .select('id, avatar_json')
        .eq('user_id', user.id);

      const existingAvatar = existingAvatars?.find(
        (item) => (item.avatar_json as any)?.imageUrl === avatarData.imageUrl
      );

      if (existingAvatar) {
        await supabase
          .from('avatar_history')
          .update({ is_current: false })
          .eq('user_id', user.id);
        
        await supabase
          .from('avatar_history')
          .update({ is_current: true })
          .eq('id', existingAvatar.id);
      } else {
        await supabase
          .from('avatar_history')
          .update({ is_current: false })
          .eq('user_id', user.id);

        await supabase
          .from('avatar_history')
          .insert({
            user_id: user.id,
            avatar_json: avatarData,
            is_current: true
          });
      }
    } catch (error) {
      console.error('Error updating avatar history:', error);
    }
  };

  // Single handler for child: generate → save → close modal (all in one click)
  const handleSaveAndContinue = async (avatarData: any) => {
    if (!user) return;
    
    try {
      const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
      
      // IMMEDIATE optimistic update
      onAvatarUpdate(avatarData);
      
      // Update profile - critical operation
      const { error: profileError } = await supabase
        .from(table)
        .update({ avatar_json: avatarData })
        .eq('user_id', user.id);

      if (profileError) {
        onAvatarUpdate(currentAvatar);
        throw profileError;
      }

      // Success - close immediately
      toast({
        title: '✓ Avatar Saved!',
        description: 'Your new avatar is now active!',
      });
      onOpenChange(false);
      
      // Handle history in background (non-blocking)
      updateAvatarHistory(avatarData);
      
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive',
      });
      throw error; // Re-throw so ObjectAvatarBuilder knows it failed
    }
  };

  const handleSaveEmoji = async (avatarObj: { id: string, emoji: string, label: string }) => {
    if (!user) return;
    
    const emojiAvatar = { 
      type: 'emoji_avatar',
      emoji: avatarObj.emoji,
      label: avatarObj.label
    };
    setLoading(true);
    
    const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
    const { error } = await supabase
      .from(table)
      .update({ avatar_json: emojiAvatar })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive',
      });
    } else {
      onAvatarUpdate(emojiAvatar);
      toast({
        title: 'Success',
        description: 'Avatar updated successfully!',
      });
      onOpenChange(false);
      
      // Update avatar history in background
      updateAvatarHistory(emojiAvatar);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Avatar</DialogTitle>
        </DialogHeader>

        {userRole === 'child' ? (
          <div className="py-4">
            <ObjectAvatarBuilder
              onSaveAndContinue={handleSaveAndContinue}
              buttonLabel="Save Avatar"
            />
          </div>
        ) : (
          <div className="py-4">
            <p className="text-center text-muted-foreground mb-4">
              Choose an avatar to represent you
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {carerAvatarObjects.map((avatar) => (
                <Button
                  key={avatar.id}
                  variant="outline"
                  onClick={() => handleSaveEmoji(avatar)}
                  disabled={loading}
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary"
                >
                  <span className="text-3xl">{avatar.emoji}</span>
                  <span className="text-xs font-medium">{avatar.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
