import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw } from 'lucide-react';

interface AvatarCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: any;
  onAvatarUpdate: (avatar: any) => void;
}

const skinTones = [
  { id: 'light', emoji: '👶🏻', label: 'Light' },
  { id: 'medium-light', emoji: '👶🏼', label: 'Medium Light' },
  { id: 'medium', emoji: '👶🏽', label: 'Medium' },
  { id: 'medium-dark', emoji: '👶🏾', label: 'Medium Dark' },
  { id: 'dark', emoji: '👶🏿', label: 'Dark' },
];

const hairStyles = [
  { id: 'short', emoji: '👦', label: 'Short' },
  { id: 'long', emoji: '👧', label: 'Long' },
  { id: 'curly', emoji: '🧑‍🦱', label: 'Curly' },
  { id: 'bald', emoji: '👨‍🦲', label: 'Bald' },
];

const accessories = [
  { id: 'none', emoji: '🙂', label: 'None' },
  { id: 'glasses', emoji: '👓', label: 'Glasses' },
  { id: 'hat', emoji: '🎩', label: 'Hat' },
  { id: 'bow', emoji: '🎀', label: 'Bow' },
];

const expressions = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'excited', emoji: '😄', label: 'Excited' },
  { id: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
];

export function AvatarCustomizer({ open, onOpenChange, currentAvatar, onAvatarUpdate }: AvatarCustomizerProps) {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [skinTone, setSkinTone] = useState(currentAvatar?.skinTone || 'medium');
  const [hairStyle, setHairStyle] = useState(currentAvatar?.hairStyle || 'short');
  const [accessory, setAccessory] = useState(currentAvatar?.accessory || 'none');
  const [expression, setExpression] = useState(currentAvatar?.expression || 'happy');

  useEffect(() => {
    if (currentAvatar) {
      setSkinTone(currentAvatar.skinTone || 'medium');
      setHairStyle(currentAvatar.hairStyle || 'short');
      setAccessory(currentAvatar.accessory || 'none');
      setExpression(currentAvatar.expression || 'happy');
    }
  }, [currentAvatar]);

  const handleSave = async () => {
    if (!user) return;

    const avatarData = { skinTone, hairStyle, accessory, expression };
    setLoading(true);

    const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
    const { error } = await supabase
      .from(table)
      .update({ avatar_json: avatarData })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save avatar',
        variant: 'destructive',
      });
    } else {
      onAvatarUpdate(avatarData);
      toast({
        title: 'Avatar saved!',
        description: 'Your avatar has been updated',
      });
      onOpenChange(false);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSkinTone('medium');
    setHairStyle('short');
    setAccessory('none');
    setExpression('happy');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="text-8xl bg-secondary/20 rounded-full p-6">
              {skinTones.find(s => s.id === skinTone)?.emoji}
              {hairStyles.find(h => h.id === hairStyle)?.emoji}
              {accessory !== 'none' && accessories.find(a => a.id === accessory)?.emoji}
              {expressions.find(e => e.id === expression)?.emoji}
            </div>
          </div>

          {/* Skin Tone */}
          <div className="space-y-2">
            <Label>Skin Tone</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {skinTones.map((tone) => (
                <Button
                  key={tone.id}
                  variant={skinTone === tone.id ? 'default' : 'outline'}
                  onClick={() => setSkinTone(tone.id)}
                  className="h-auto py-3 flex flex-col gap-1"
                >
                  <span className="text-2xl">{tone.emoji}</span>
                  <span className="text-xs">{tone.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div className="space-y-2">
            <Label>Hair Style</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {hairStyles.map((style) => (
                <Button
                  key={style.id}
                  variant={hairStyle === style.id ? 'default' : 'outline'}
                  onClick={() => setHairStyle(style.id)}
                  className="h-auto py-3 flex flex-col gap-1"
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="text-xs">{style.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="space-y-2">
            <Label>Accessories</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {accessories.map((acc) => (
                <Button
                  key={acc.id}
                  variant={accessory === acc.id ? 'default' : 'outline'}
                  onClick={() => setAccessory(acc.id)}
                  className="h-auto py-3 flex flex-col gap-1"
                >
                  <span className="text-2xl">{acc.emoji}</span>
                  <span className="text-xs">{acc.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Expression */}
          <div className="space-y-2">
            <Label>Expression</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {expressions.map((exp) => (
                <Button
                  key={exp.id}
                  variant={expression === exp.id ? 'default' : 'outline'}
                  onClick={() => setExpression(exp.id)}
                  className="h-auto py-3 flex flex-col gap-1"
                >
                  <span className="text-2xl">{exp.emoji}</span>
                  <span className="text-xs">{exp.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Avatar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
