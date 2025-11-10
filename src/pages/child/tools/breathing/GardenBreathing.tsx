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

export default function GardenBreathing() {
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
    theme: 'nature', 
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
    }, 4000);

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
          tool_name: 'Magic Garden Breathing',
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
          <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200">
            <div className="text-6xl">🌸</div>
            <h2 className="text-2xl font-bold text-pink-800 dark:text-pink-300">
              You're blooming beautifully — calm and kind
            </h2>
            <p className="text-lg text-pink-700 dark:text-pink-400">
              You completed {duration} {duration === 1 ? 'minute' : 'minutes'} of magic garden breathing.
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 dark:from-pink-950 dark:via-rose-950 dark:to-pink-900 p-6">
      <div className="max-w-2xl mx-auto space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-pink-800 dark:text-pink-200">🌺 Magic Garden</h1>
          <div className="w-20" />
        </div>

        {!isBreathing && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-pink-800 dark:text-pink-300">Choose your duration:</h3>
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
          <div className="absolute inset-0">
            {['🦋', '🐝', '🌼', '🌺', '🌻'].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 30}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-4000 ${
              breathingIn ? 'scale-120 rotate-0 opacity-100' : 'scale-80 rotate-12 opacity-70'
            }`}
          >
            <div className="text-[200px] filter drop-shadow-lg">
              🌸
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-3xl font-bold text-pink-800 dark:text-pink-200 bg-white/90 dark:bg-black/50 px-8 py-4 rounded-full shadow-lg">
              {isBreathing ? (breathingIn ? 'Bloom Open 🌸' : 'Gently Close 🌺') : 'Ready to Begin?'}
            </p>
          </div>
        </div>

        {isBreathing && (
          <Card className="p-6 text-center">
            <p className="text-xl font-semibold text-pink-700 dark:text-pink-300">
              {Math.floor(cyclesComplete / 2)} / {Math.floor(totalCycles / 2)} breaths
            </p>
            <div className="w-full bg-pink-200 dark:bg-pink-800 rounded-full h-3 mt-4">
              <div
                className="bg-pink-600 dark:bg-pink-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(cyclesComplete / totalCycles) * 100}%` }}
              />
            </div>
          </Card>
        )}

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => (isBreathing ? setIsBreathing(false) : startBreathing())}
            className="w-full px-8"
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

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200">
          <p className="text-center text-pink-800 dark:text-pink-300 leading-relaxed">
            🌸 Welcome to your magic garden. Like a flower opening to the sun, 
            breathe in peace and kindness. You're growing and blooming beautifully.
          </p>
        </Card>
      </div>
      <BottomNav role="child" />
    </div>
  );
}
