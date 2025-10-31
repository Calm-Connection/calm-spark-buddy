import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function StarBreathing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [duration, setDuration] = useState(3);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const totalCycles = duration * 7.5;

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
          tool_name: 'Star Breathing',
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
          <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200">
            <div className="text-6xl">⭐</div>
            <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
              You shine even in the dark
            </h2>
            <p className="text-lg text-indigo-700 dark:text-indigo-400">
              You completed {duration} {duration === 1 ? 'minute' : 'minutes'} of cosmic star breathing.
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 p-6">
      <div className="max-w-2xl mx-auto space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/child/tools/breathing-space')} className="text-white">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-white">⭐ Star Breathing</h1>
          <div className="w-20" />
        </div>

        {!isBreathing && (
          <Card className="p-6 space-y-4 bg-white/10 backdrop-blur border-white/20">
            <h3 className="font-semibold text-white">Choose your duration:</h3>
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
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>
          
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-4000 ${
              breathingIn ? 'scale-125 opacity-100' : 'scale-75 opacity-40'
            }`}
          >
            <div className="text-[200px] filter drop-shadow-2xl">
              ⭐
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-3xl font-bold text-white bg-indigo-900/80 px-8 py-4 rounded-full shadow-lg">
              {isBreathing ? (breathingIn ? 'Breathe In ✨' : 'Breathe Out 🌙') : 'Ready to Begin?'}
            </p>
          </div>
        </div>

        {isBreathing && (
          <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
            <p className="text-xl font-semibold text-white">
              {Math.floor(cyclesComplete / 2)} / {Math.floor(totalCycles / 2)} breaths
            </p>
            <div className="w-full bg-indigo-800/50 rounded-full h-3 mt-4">
              <div
                className="bg-indigo-300 h-3 rounded-full transition-all duration-500"
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
          <Button
            size="lg"
            variant="outline"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </Button>
        </div>

        <Card className="p-6 bg-indigo-950/50 backdrop-blur border-indigo-700/50">
          <p className="text-center text-white leading-relaxed">
            ⭐ You are a shining star in the night sky. Breathe in the cosmic calm, 
            breathe out any darkness. You always shine bright, even when things feel dark.
          </p>
        </Card>
      </div>
      <BottomNav role="child" />
    </div>
  );
}
