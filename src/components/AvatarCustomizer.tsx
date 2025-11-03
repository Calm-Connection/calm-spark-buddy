import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvatarBuilder } from '@/components/children/AvatarBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface AvatarCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: any;
  onAvatarUpdate: (avatar: any) => void;
}

export function AvatarCustomizer({ open, onOpenChange, currentAvatar, onAvatarUpdate }: AvatarCustomizerProps) {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newAvatarData, setNewAvatarData] = useState<any>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const carerEmojis = ['👨', '👩', '🧑', '👨‍🦱', '👩‍🦱', '🧑‍🦱', '👨‍🦰', '👩‍🦰', '🧑‍🦰', '👨‍🦲', '👩‍🦲', '🧑‍🦲'];

  // Carer pre-made avatar prompts
  const carerAvatarPresets = [
    { id: 'parent1', label: 'Friendly Parent', prompt: 'A warm, friendly parent with a gentle smile, Disney Pixar style' },
    { id: 'parent2', label: 'Professional Carer', prompt: 'A professional caregiver with glasses and warm expression, Disney style' },
    { id: 'parent3', label: 'Young Parent', prompt: 'A young parent with casual style and bright smile, Pixar animation style' },
    { id: 'parent4', label: 'Mature Carer', prompt: 'A mature caregiver with kind eyes and caring demeanor, Disney style' },
    { id: 'parent5', label: 'Active Parent', prompt: 'An active parent in sporty attire with energetic smile, Pixar style' },
    { id: 'parent6', label: 'Creative Carer', prompt: 'A creative caregiver with artistic flair and warm personality, Disney style' },
  ];
  
  useEffect(() => {
    if (open) {
      setNewAvatarData(null);
      setSelectedPreset(null);
    }
  }, [open]);

  const handleAvatarGenerated = async (data: any) => {
    console.log('Avatar generated in customizer:', data);
    setNewAvatarData(data);
    
    // Save to avatar history
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('avatar_history').insert({
          user_id: user.id,
          avatar_json: data,
          is_current: false
        });
      }
    } catch (error) {
      console.error('Error saving to avatar history:', error);
    }
  };

  const handleGeneratePreset = async (preset: any) => {
    setSelectedPreset(preset.id);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { type: 'carer', prompt: preset.prompt }
      });

      if (error) throw error;
      
      setNewAvatarData({
        type: 'disney_custom',
        imageUrl: data.imageUrl,
      });
      toast({
        title: 'Success',
        description: 'Avatar generated!',
      });
    } catch (error: any) {
      console.error('Avatar generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSelectedPreset(null);
    }
  };

  const handleSaveAvatar = async () => {
    if (!user || !newAvatarData) return;
    
    setLoading(true);
    try {
      // Check if this exact avatar already exists in history as current
      const { data: existingCurrent } = await supabase
        .from('avatar_history')
        .select('id, avatar_json')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .single();

      const isDifferent = !existingCurrent || 
        (existingCurrent.avatar_json as any)?.imageUrl !== newAvatarData.imageUrl;

      if (!isDifferent) {
        toast({
          title: 'No changes',
          description: 'This avatar is already saved as your current avatar',
        });
        setLoading(false);
        return;
      }

      const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
      
      // Update the profile with new avatar
      const { error: profileError } = await supabase
        .from(table)
        .update({ avatar_json: newAvatarData })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Mark all history as not current
      await supabase
        .from('avatar_history')
        .update({ is_current: false })
        .eq('user_id', user.id);

      // Insert new history record as current
      const { error: historyError } = await supabase
        .from('avatar_history')
        .insert({
          user_id: user.id,
          avatar_json: newAvatarData,
          is_current: true
        });

      if (historyError) {
        console.error('History insert error:', historyError);
      }

      onAvatarUpdate(newAvatarData);
      toast({
        title: 'Success',
        description: 'Avatar updated successfully!',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmoji = async (emoji: string) => {
    if (!user) return;
    
    const emojiAvatar = { emoji };
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
            <AvatarBuilder onAvatarGenerated={handleAvatarGenerated} />
            
            {newAvatarData && (
              <div className="mt-6">
                <Button 
                  onClick={handleSaveAvatar}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Avatar'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <Tabs defaultValue="presets">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="presets">Pre-made Avatars</TabsTrigger>
                <TabsTrigger value="emoji">Emoji Style</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {carerAvatarPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      onClick={() => handleGeneratePreset(preset)}
                      disabled={loading}
                      className="h-auto py-6 flex flex-col items-center justify-center"
                    >
                      {loading && selectedPreset === preset.id ? (
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      ) : (
                        <div className="text-4xl mb-2">👤</div>
                      )}
                      <span className="text-sm font-medium">{preset.label}</span>
                    </Button>
                  ))}
                </div>
                
                {newAvatarData?.imageUrl && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <img 
                        src={newAvatarData.imageUrl} 
                        alt="Generated avatar" 
                        className="w-48 h-48 mx-auto rounded-lg object-cover"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveAvatar}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Saving...' : 'Save This Avatar'}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="emoji" className="space-y-4 mt-4">
                <div className="grid grid-cols-6 gap-2">
                  {carerEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      size="lg"
                      onClick={() => handleSaveEmoji(emoji)}
                      disabled={loading}
                      className="text-3xl p-4 h-auto"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
