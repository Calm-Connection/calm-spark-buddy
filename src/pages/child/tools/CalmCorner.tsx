import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { WendyTipCard } from '@/components/WendyTipCard';
import { useBreathingAudio } from '@/hooks/useBreathingAudio';

type LightingType = 'warm' | 'cool' | 'rainbow';
type SoundType = 'rain' | 'ocean' | 'wind' | 'chimes';
type ComfortItem = 'teddy' | 'blanket' | 'star' | 'pet';

const lightingOptions: { value: LightingType; label: string; emoji: string; gradient: string }[] = [
  { value: 'warm', label: 'Warm Glow', emoji: '🔆', gradient: 'from-amber-300 via-orange-300 to-amber-400' },
  { value: 'cool', label: 'Cool Calm', emoji: '🌙', gradient: 'from-blue-300 via-cyan-300 to-blue-400' },
  { value: 'rainbow', label: 'Rainbow Magic', emoji: '🌈', gradient: 'from-pink-300 via-purple-300 to-blue-300' },
];

const soundOptions: { value: SoundType; label: string; emoji: string }[] = [
  { value: 'rain', label: 'Gentle Rain', emoji: '🌧️' },
  { value: 'ocean', label: 'Ocean Waves', emoji: '🌊' },
  { value: 'wind', label: 'Soft Wind', emoji: '🍃' },
  { value: 'chimes', label: 'Wind Chimes', emoji: '🎐' },
];

const comfortItems: { value: ComfortItem; label: string; emoji: string }[] = [
  { value: 'teddy', label: 'Teddy Bear', emoji: '🧸' },
  { value: 'blanket', label: 'Cozy Blanket', emoji: '🛏️' },
  { value: 'star', label: 'Shining Star', emoji: '⭐' },
  { value: 'pet', label: 'Tiny Pet', emoji: '🐾' },
];

export default function CalmCorner() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'lighting' | 'sound' | 'item' | 'complete'>('lighting');
  const [lighting, setLighting] = useState<LightingType | null>(null);
  const [sound, setSound] = useState<SoundType | null>(null);
  const [item, setItem] = useState<ComfortItem | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useBreathingAudio({ 
    theme: sound || 'chimes', 
    enabled: audioEnabled && step === 'complete', 
    volume: 0.3 
  });

  const handleLightingSelect = (value: LightingType) => {
    setLighting(value);
    setTimeout(() => setStep('sound'), 300);
  };

  const handleSoundSelect = (value: SoundType) => {
    setSound(value);
    setTimeout(() => setStep('item'), 300);
  };

  const handleItemSelect = (value: ComfortItem) => {
    setItem(value);
    setTimeout(() => {
      setStep('complete');
      setAudioEnabled(true);
    }, 300);
  };

  const handleReset = () => {
    setAudioEnabled(false);
    setLighting(null);
    setSound(null);
    setItem(null);
    setStep('lighting');
  };

  const selectedLighting = lightingOptions.find(l => l.value === lighting);
  const selectedSound = soundOptions.find(s => s.value === sound);
  const selectedItem = comfortItems.find(i => i.value === item);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent/5 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/child/tools')} 
            className="hover:bg-interactive-accent/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Create My Calm Corner 🏡
          </h1>
        </div>

        {step !== 'complete' && (
          <p className="text-muted-foreground font-medium">
            {step === 'lighting' && 'Choose your lighting'}
            {step === 'sound' && 'Pick a soothing sound'}
            {step === 'item' && 'Add a comfort item'}
          </p>
        )}

        {step === 'lighting' && (
          <div className="grid grid-cols-1 gap-4">
            {lightingOptions.map((option) => (
              <Card
                key={option.value}
                className="p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-soft-lg"
                onClick={() => handleLightingSelect(option.value)}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center text-3xl shadow-soft`}>
                    {option.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{option.label}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 'sound' && (
          <div className="grid grid-cols-1 gap-4">
            {soundOptions.map((option) => (
              <Card
                key={option.value}
                className="p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-soft-lg"
                onClick={() => handleSoundSelect(option.value)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl shadow-soft">
                    {option.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{option.label}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 'item' && (
          <div className="grid grid-cols-2 gap-4">
            {comfortItems.map((option) => (
              <Card
                key={option.value}
                className="p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-soft-lg"
                onClick={() => handleItemSelect(option.value)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-5xl">{option.emoji}</div>
                  <h3 className="font-bold">{option.label}</h3>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 'complete' && selectedLighting && selectedSound && selectedItem && (
          <div className="space-y-6 animate-fade-in">
            <Card className={`p-8 bg-gradient-to-br ${selectedLighting.gradient} min-h-[400px] flex flex-col items-center justify-center gap-6 shadow-soft-lg`}>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                  Your Calm Corner ✨
                </h2>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>
                    {selectedLighting.emoji}
                  </div>
                  <div className="text-6xl">{selectedItem.emoji}</div>
                  <div className="text-6xl animate-pulse" style={{ animationDuration: '2s' }}>
                    {selectedSound.emoji}
                  </div>
                </div>
                <p className="text-white/90 text-lg font-medium">
                  This is your special place. Take a deep breath and feel calm.
                </p>
              </div>
            </Card>

            <WendyTipCard tip="When you need peace, you can always visit your calm corner in your mind. Close your eyes and imagine this safe, cozy space. 🌟" />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Create New Corner
              </Button>
              <Button 
                onClick={() => navigate('/child/tools')}
                className="flex-1"
              >
                <Check className="mr-2 h-4 w-4" />
                Done
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
