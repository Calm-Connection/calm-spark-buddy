import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VolumeControl } from '@/components/VolumeControl';
import { useBreathingAudio } from '@/hooks/useBreathingAudio';

export default function OceanBreathing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [duration, setDuration] = useState<1 | 3 | 5>(3);

  const totalCycles = duration * 60 / 8;

  useBreathingAudio({ 
    theme: 'waves', 
    enabled: soundEnabled && isBreathing, 
    volume 
  });

  useEffect(() => {
    if (!isBreathing) return;

    const breathCycle = 4000; // 4 seconds
    const timer = setTimeout(() => {
      setBreathingIn(!breathingIn);
      if (!breathingIn) {
        setCyclesComplete(prev => prev + 1);
      }
    }, breathCycle);

    return () => clearTimeout(timer);
  }, [isBreathing, breathingIn]);

  useEffect(() => {
    if (cyclesComplete >= totalCycles && isBreathing) {
      completeExercise();
    }
  }, [cyclesComplete, isBreathing, totalCycles]);

  const completeExercise = async () => {
    setIsBreathing(false);
    setShowAffirmation(true);
    
    // Track usage for carer insights
    if (user) {
      try {
        await supabase.from('tool_usage' as any).insert({
          user_id: user.id,
          tool_name: 'Ocean Breathing',
          duration_minutes: duration,
          completed: true
        });
      } catch (error) {
        console.log('Tool usage tracking will be available once types update');
      }
    }
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingIn(true);
    setCyclesComplete(0);
    setShowAffirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-cyan-50 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ocean Breathing 🌊</h1>
        </div>

        {/* Duration Selector */}
        {!isBreathing && !showAffirmation && (
          <Card className="p-6 bg-white/50 backdrop-blur animate-fade-in">
            <h3 className="font-bold mb-4 text-center">How long would you like to breathe?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 3, 5].map((min) => (
                <Button
                  key={min}
                  variant={duration === min ? 'default' : 'outline'}
                  onClick={() => setDuration(min as 1 | 3 | 5)}
                  className="py-6"
                >
                  {min} min
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Breathing Animation */}
        <div className="relative flex items-center justify-center min-h-[450px]">
          {/* Wave layers with staggered animations */}
          <div
            className={`absolute rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-400/40 transition-all duration-[4000ms] ease-in-out ${
              isBreathing
                ? breathingIn
                  ? 'w-80 h-80 opacity-60'
                  : 'w-40 h-40 opacity-20'
                : 'w-60 h-60 opacity-40'
            }`}
            style={{ 
              boxShadow: '0 0 80px rgba(59, 130, 246, 0.5)',
              filter: 'blur(2px)'
            }}
          />
          <div
            className={`absolute rounded-full bg-gradient-to-br from-cyan-300/30 to-blue-300/30 transition-all duration-[4000ms] ease-in-out ${
              isBreathing
                ? breathingIn
                  ? 'w-64 h-64 opacity-50'
                  : 'w-32 h-32 opacity-15'
                : 'w-48 h-48 opacity-30'
            }`}
            style={{ 
              boxShadow: '0 0 60px rgba(34, 211, 238, 0.4)',
              transitionDelay: '200ms'
            }}
          />
          
          {isBreathing && (
            <div className="absolute text-center z-10 px-6 animate-fade-in">
              <p className="text-2xl font-bold mb-4 text-blue-900">
                {breathingIn ? "Breathe in as the wave rises..." : "Breathe out as it falls..."}
              </p>
              <p className="text-sm text-blue-700/70">
                Cycle {cyclesComplete + 1} of {Math.ceil(totalCycles)}
              </p>
            </div>
          )}

          {!isBreathing && !showAffirmation && (
            <div className="absolute text-center z-10 animate-fade-in">
              <p className="text-lg text-blue-900/70 mb-2">
                Like gentle ocean waves...
              </p>
              <p className="text-sm text-blue-700/60">
                Let each breath flow naturally
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isBreathing && !showAffirmation ? (
            <Button
              onClick={startBreathing}
              className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              size="lg"
            >
              Start Ocean Breathing ✨
            </Button>
          ) : isBreathing ? (
            <Button
              onClick={() => setIsBreathing(false)}
              variant="outline"
              className="w-full"
            >
              Pause
            </Button>
          ) : null}

          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        </div>

        {/* Affirmation */}
        {showAffirmation && (
          <Card className="p-8 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-400 animate-scale-in text-center space-y-4">
            <div className="text-5xl mb-4">🌊</div>
            <p className="text-xl font-bold text-blue-900">
              You're calm like the sea — peaceful and steady
            </p>
            <p className="text-blue-700">
              Amazing work! Your mind and body feel more relaxed now.
            </p>
            <div className="pt-4 space-y-2">
              <Button
                onClick={() => navigate('/child/journal-entry')}
                variant="default"
                className="w-full"
              >
                Write about how you feel 📝
              </Button>
              <Button
                onClick={() => navigate('/child/tools/breathing-space')}
                variant="outline"
                className="w-full"
              >
                Try another breathing world
              </Button>
            </div>
          </Card>
        )}

        {!showAffirmation && (
          <Card className="p-4 bg-blue-50/50">
            <p className="text-sm text-blue-900/70 text-center">
              💙 Let the rhythm of the ocean guide your breathing. In and out, like waves on the shore.
            </p>
          </Card>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
