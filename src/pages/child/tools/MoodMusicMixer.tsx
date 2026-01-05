import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useBreathingAudio } from '@/hooks/useBreathingAudio';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';

export default function MoodMusicMixer() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [calmLevel, setCalmLevel] = useState([50]);
  const [happyLevel, setHappyLevel] = useState([50]);
  const [focusLevel, setFocusLevel] = useState([50]);

  // Use multiple audio instances for mixing (simplified version)
  useBreathingAudio({ 
    theme: 'ocean', 
    enabled: isPlaying, 
    volume: calmLevel[0] / 100 * 0.3 
  });

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const getDominantMood = () => {
    const levels = [
      { name: 'Calm', value: calmLevel[0], emoji: '🌊' },
      { name: 'Happy', value: happyLevel[0], emoji: '☀️' },
      { name: 'Focus', value: focusLevel[0], emoji: '🎯' },
    ];
    return levels.reduce((max, curr) => curr.value > max.value ? curr : max);
  };

  const dominant = getDominantMood();

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
            Mood Music Mixer 🎵
          </h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Adjust the sliders to create your perfect soundscape
        </p>

        <Card className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">🌊 Calm</span>
              <span className="text-sm text-muted-foreground">{calmLevel[0]}%</span>
            </div>
            <Slider
              value={calmLevel}
              onValueChange={setCalmLevel}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">☀️ Happy</span>
              <span className="text-sm text-muted-foreground">{happyLevel[0]}%</span>
            </div>
            <Slider
              value={happyLevel}
              onValueChange={setHappyLevel}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">🎯 Focus</span>
              <span className="text-sm text-muted-foreground">{focusLevel[0]}%</span>
            </div>
            <Slider
              value={focusLevel}
              onValueChange={setFocusLevel}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
          <div className="text-5xl">{dominant.emoji}</div>
          <div>
            <h3 className="font-bold text-lg">Your Mix: {dominant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {dominant.name === 'Calm' && 'A peaceful, relaxing soundscape'}
              {dominant.name === 'Happy' && 'An uplifting, cheerful mix'}
              {dominant.name === 'Focus' && 'A centered, concentrating atmosphere'}
            </p>
          </div>
        </Card>

        <Button 
          onClick={togglePlayback}
          className="w-full"
          size="lg"
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Pause Mix
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Play Mix
            </>
          )}
        </Button>

        <div className="mt-4">
          <DisclaimerCard variant="tool-limitation" size="small" />
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
