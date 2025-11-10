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

export default function ForestBreathing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [duration, setDuration] = useState(3);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const totalCycles = duration * 7.5;

  useBreathingAudio({ 
    theme: 'forest', 
    enabled: soundEnabled && isBreathing, 
    volume 
  });

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setBreathingIn(prev => !prev);
      if (breathingIn) {
        setCyclesComplete(prev => prev + 1);
      }
    }, 4000); // 4 seconds in, 4 seconds out

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
          tool_name: 'Forest Breathing',
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
    setShowAffirmation(false);
    setIsBreathing(true);
  };

  if (showAffirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <div className="max-w-2xl mx-auto space-y-8 pb-24">
          <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
            <div className="text-6xl">🌳</div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
              You're grounded like a tree — strong and calm
            </h2>
            <p className="text-lg text-green-700 dark:text-green-400">
              You completed {duration} {duration === 1 ? 'minute' : 'minutes'} of peaceful forest breathing.
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:via-emerald-950 dark:to-green-900 p-6">
      <div className="max-w-2xl mx-auto space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">🌲 Forest Breathing</h1>
          <div className="w-20" />
        </div>

        {!isBreathing && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300">Choose your duration:</h3>
            <div className="flex gap-3">
              {[1, 3, 5].map((min) => (
                <Button
                  key={min}
                  variant={duration === min ? "default" : "outline"}
                  onClick={() => setDuration(min)}
                  className="flex-1"
                >
                  {min} min
                </Button>
              ))}
            </div>
          </Card>
        )}

        <div className="relative h-[400px] flex items-center justify-center">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-4000 ${
              breathingIn ? 'scale-110 opacity-100' : 'scale-90 opacity-60'
            }`}
          >
            <div className="text-[200px] filter drop-shadow-lg animate-pulse">
              🍃
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-3xl font-bold text-green-800 dark:text-green-200 bg-white/80 dark:bg-black/40 px-8 py-4 rounded-full shadow-lg">
              {isBreathing ? (breathingIn ? 'Breathe In 🌲' : 'Breathe Out 🍂') : 'Ready to Begin?'}
            </p>
          </div>
        </div>

        {isBreathing && (
          <Card className="p-6 text-center">
            <p className="text-xl font-semibold text-green-700 dark:text-green-300">
              {Math.floor(cyclesComplete / 2)} / {Math.floor(totalCycles / 2)} breaths
            </p>
            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3 mt-4">
              <div
                className="bg-green-600 dark:bg-green-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(cyclesComplete / totalCycles) * 100}%` }}
              />
            </div>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => (isBreathing ? setIsBreathing(false) : startBreathing())}
            className="px-8"
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

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
          <p className="text-center text-green-800 dark:text-green-300 leading-relaxed">
            🌳 Imagine you're a tall, strong tree with roots deep in the earth. 
            Breathe in the fresh forest air, breathe out your worries like falling leaves.
          </p>
        </Card>
      </div>
      <BottomNav role="child" />
    </div>
  );
}
