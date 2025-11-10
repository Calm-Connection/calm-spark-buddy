import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { VolumeControl } from '@/components/VolumeControl';
import { useBreathingAudio } from '@/hooks/useBreathingAudio';

const visualThemes = [
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', gradient: 'from-blue-400 to-cyan-300' },
  { id: 'cloud', name: 'Floating Clouds', emoji: '☁️', gradient: 'from-sky-200 to-blue-100' },
  { id: 'forest', name: 'Forest Haven', emoji: '🌲', gradient: 'from-green-400 to-emerald-300' },
  { id: 'star', name: 'Starry Night', emoji: '⭐', gradient: 'from-indigo-500 to-purple-400' },
  { id: 'garden', name: 'Magic Garden', emoji: '🌼', gradient: 'from-pink-300 to-yellow-200' },
  { id: 'rainbow', name: 'Rainbow Sky', emoji: '🌈', gradient: 'from-red-300 via-yellow-300 to-purple-300' },
  { id: 'sunset', name: 'Sunset Glow', emoji: '🌅', gradient: 'from-orange-400 to-pink-400' },
  { id: 'space', name: 'Deep Space', emoji: '🌌', gradient: 'from-purple-900 to-black' },
];

const soundThemes = [
  { id: 'waves', name: 'Ocean Waves', emoji: '🌊' },
  { id: 'wind', name: 'Gentle Wind', emoji: '💨' },
  { id: 'birds', name: 'Forest Birds', emoji: '🐦' },
  { id: 'rain', name: 'Soft Rain', emoji: '🌧️' },
  { id: 'chimes', name: 'Wind Chimes', emoji: '🎐' },
  { id: 'nature', name: 'Nature Sounds', emoji: '🍃' },
  { id: 'night', name: 'Night Ambience', emoji: '🌙' },
  { id: 'music', name: 'Calm Music', emoji: '🎵' },
];

export default function CreateCustom() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedVisual, setSelectedVisual] = useState('ocean');
  const [selectedSound, setSelectedSound] = useState('waves');
  const [spaceName, setSpaceName] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [isSaving, setIsSaving] = useState(false);

  useBreathingAudio({ 
    theme: selectedSound, 
    enabled: soundEnabled, 
    volume 
  });

  const selectedVisualTheme = visualThemes.find(t => t.id === selectedVisual) || visualThemes[0];

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save your custom space",
        variant: "destructive"
      });
      return;
    }

    if (!spaceName.trim()) {
      toast({
        title: "Name required",
        description: "Please give your calm space a name",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get child profile
      const { data: profile } = await supabase
        .from('children_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Save custom space
      const { error } = await supabase
        .from('custom_breathing_spaces')
        .insert({
          child_id: profile.id,
          name: spaceName.trim(),
          visual_theme: selectedVisual,
          sound_theme: selectedSound
        });

      if (error) throw error;

      toast({
        title: "Calm space saved! ✨",
        description: `"${spaceName}" is ready whenever you need it`
      });

      navigate('/child/tools/breathing-space');
    } catch (error: any) {
      toast({
        title: "Couldn't save space",
        description: error.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Your Calm Space ✨</h1>
            <p className="text-sm text-muted-foreground">Mix and match to make it perfect for you!</p>
          </div>
        </div>

        {/* Live Preview */}
        <Card className={`p-8 relative overflow-hidden bg-gradient-to-br ${selectedVisualTheme.gradient}`}>
          <div className="relative z-10 text-center space-y-4">
            <div className="text-6xl animate-scale-in">{selectedVisualTheme.emoji}</div>
            <h3 className="text-xl font-bold text-white drop-shadow-lg">
              {spaceName || 'Your Calm Space'}
            </h3>
            <p className="text-white/90 drop-shadow">
              {selectedVisualTheme.name} with {soundThemes.find(s => s.id === selectedSound)?.name}
            </p>
          </div>
        </Card>

        {/* Name Input */}
        <Card className="p-6 space-y-4">
          <Label htmlFor="spaceName">Name Your Space</Label>
          <Input
            id="spaceName"
            placeholder="My Calm Space"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value.slice(0, 30))}
            maxLength={30}
          />
          <p className="text-xs text-muted-foreground">{spaceName.length}/30 characters</p>
        </Card>

        {/* Visual Theme Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Your Scene 🎨</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visualThemes.map((theme) => (
              <Card
                key={theme.id}
                className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                  selectedVisual === theme.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedVisual(theme.id)}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">{theme.emoji}</div>
                  <p className="text-sm font-medium">{theme.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sound Theme Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Your Sound 🔊</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {soundThemes.map((theme) => (
              <Card
                key={theme.id}
                className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                  selectedSound === theme.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedSound(theme.id)}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">{theme.emoji}</div>
                  <p className="text-sm font-medium">{theme.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <VolumeControl
          volume={volume}
          onVolumeChange={setVolume}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={isSaving || !spaceName.trim()}
            className="w-full text-lg py-6"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {isSaving ? 'Saving...' : 'Save My Calm Space'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/child/tools/breathing-space')}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-sm text-center">
            <Sparkles className="inline h-4 w-4 mr-1" />
            Your custom space will be saved and ready to use anytime!
          </p>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
