import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VolumeControl } from '@/components/VolumeControl';
import { useBreathingAudio } from '@/hooks/useBreathingAudio';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const rainbowColors = [
  'from-red-400 to-orange-400',
  'from-orange-400 to-yellow-400',
  'from-yellow-400 to-green-400',
  'from-green-400 to-blue-400',
  'from-blue-400 to-indigo-400',
  'from-indigo-400 to-purple-400',
  'from-purple-400 to-pink-400',
];

export default function RainbowBreathing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const duration = 1; // Fixed 1 minute
  const totalCycles = 15; // 15 cycles in 1 minute (4 seconds per cycle)

  useBreathingAudio({ 
    theme: 'music', 
    enabled: soundEnabled && isBreathing, 
    volume 
  });

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setBreathingIn(prev => !prev);
      if (breathingIn) {
        setCyclesComplete(prev => prev + 1);
        setCurrentColorIndex(prev => (prev + 1) % rainbowColors.length);
      }
    }, 2000); // Faster: 2 seconds in, 2 seconds out

    return () => clearInterval(interval);
  }, [isBreathing, breathingIn]);

  useEffect(() => {
    if (cyclesComplete >= totalCycles && isBreathing) {
      completeExercise();
    }
  }, [cyclesComplete, totalCycles, isBreathing]);

  const completeExercise = async () => {
    setIsBreathing(false);
    setShowAffirmation(true);
    if (user) {
      try {
        await supabase.from('tool_usage' as any).insert({
          user_id: user.id,
          tool_name: 'Rainbow Rhythm',
          duration_minutes: duration,
          completed: true
        });
      } catch (error) {
        console.log('Tool usage tracking will be available once types update');
      }
    }
  };

  const startBreathing = () => {
    setCyclesComplete(0);
    setCurrentColorIndex(0);
    setShowAffirmation(false);
    setIsBreathing(true);
  };

  if (showAffirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <div className="max-w-2xl mx-auto space-y-8 pb-24">
          <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-red-50 via-yellow-50 via-green-50 via-blue-50 to-purple-50 dark:from-red-950/20 dark:to-purple-950/20 border-purple-200">
            <div className="text-6xl">🌈</div>
<h2 className="text-2xl font-bold bg-gradient-to-r from-red-700 via-amber-700 via-green-700 via-blue-700 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
              Every color belongs — and so do you
            </h2>
            <p className="text-lg text-purple-700 dark:text-purple-400">
              You completed your 1-minute rainbow reset! Your feelings make you wonderfully unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => navigate('/child/journal/entry')} size="lg">
                Journal Your Feelings
              </Button>
              <Button onClick={() => navigate('/child/tools/breathing-space')} variant="outline" size="lg">
                Try Another Exercise
              </Button>
            </div>
          </Card>
        </div>
        <BottomNav role="child" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${rainbowColors[currentColorIndex]} transition-all duration-2000 p-6`}>
      <div className="max-w-2xl mx-auto space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/child/tools/breathing-space')} className="bg-white/20 backdrop-blur">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">🌈 Rainbow Rhythm</h1>
          <div className="w-20" />
        </div>

        {!isBreathing && (
          <Card className="p-6 space-y-4 bg-white/90 backdrop-blur">
            <h3 className="font-semibold text-center">Quick 1-Minute Emotion Reset</h3>
            <p className="text-sm text-muted-foreground text-center">
              Perfect when you need a fast mood boost! Each breath cycles through a rainbow color.
            </p>
          </Card>
        )}

        <div className="relative h-[400px] flex items-center justify-center">
          {isBreathing && (
            <div className="absolute inset-0 pointer-events-none">
              {['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'].map((color, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 ${color} rounded-full animate-float opacity-70`}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.4}s`
                  }}
                />
              ))}
            </div>
          )}

          <div
            className={`absolute w-[300px] h-[300px] rounded-full ${
              isBreathing && breathingIn
                ? 'animate-glow-pulse'
                : ''
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
            }}
          />

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all ${
              isBreathing
                ? breathingIn
                  ? 'scale-125 duration-[2000ms] animate-shimmer'
                  : 'scale-85 duration-[2000ms]'
                : 'scale-100'
            }`}
          >
            <div 
              className="text-[250px] filter"
              style={{
                filter: isBreathing && breathingIn
                  ? 'drop-shadow(0 0 60px rgba(255, 255, 255, 0.9)) brightness(1.4)'
                  : 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.5)) brightness(1)',
                transition: 'filter 2s ease-in-out'
              }}
            >
              🌈
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-3xl font-bold text-white bg-black/40 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl">
              {isBreathing ? (breathingIn ? 'Breathe In 🌈' : 'Breathe Out ✨') : 'Ready for Reset?'}
            </p>
          </div>
        </div>

        {isBreathing && (
          <Card className="p-6 text-center bg-white/90 backdrop-blur">
            <p className="text-xl font-semibold">
              {Math.floor(cyclesComplete / 2)} / {Math.floor(totalCycles / 2)} breaths
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(cyclesComplete / totalCycles) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {60 - (cyclesComplete * 4)} seconds left
            </p>
          </Card>
        )}

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => (isBreathing ? setIsBreathing(false) : startBreathing())}
            className="w-full px-8 bg-white/90 hover:bg-white text-black"
          >
            {isBreathing ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Start</>}
          </Button>
          
          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        </div>

        <Card className="p-6 bg-white/90 backdrop-blur">
          <p className="text-center leading-relaxed">
            🌈 All your feelings are important — happy, sad, excited, worried. 
            Like a rainbow needs every color, you need every emotion. You belong just as you are!
          </p>
        </Card>
      </div>
      <BottomNav role="child" />
    </div>
  );
}
