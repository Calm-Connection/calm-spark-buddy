import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function CloudBreathing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [duration, setDuration] = useState<1 | 3 | 5>(3);

  const totalCycles = duration * 60 / 8;

  useEffect(() => {
    if (!isBreathing) return;
    const timer = setTimeout(() => {
      setBreathingIn(!breathingIn);
      if (!breathingIn) setCyclesComplete(prev => prev + 1);
    }, 4000);
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
    if (user) {
      await supabase.from('tool_usage').insert({
        user_id: user.id,
        tool_name: 'Cloud Breathing',
        duration_minutes: duration,
        completed: true
      });
    }
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingIn(true);
    setCyclesComplete(0);
    setShowAffirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-100 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Cloud Breathing ☁️</h1>
        </div>

        {!isBreathing && !showAffirmation && (
          <Card className="p-6 bg-white/60 backdrop-blur animate-fade-in">
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

        <div className="relative flex items-center justify-center min-h-[450px] overflow-hidden">
          {/* Animated cloud */}
          <div
            className={`absolute rounded-[60%] bg-gradient-to-br from-white/90 to-sky-200/60 transition-all duration-[4000ms] ease-in-out ${
              isBreathing
                ? breathingIn
                  ? 'w-96 h-64 opacity-90 scale-110'
                  : 'w-48 h-32 opacity-40 scale-90'
                : 'w-72 h-48 opacity-70'
            }`}
            style={{ 
              boxShadow: '0 20px 60px rgba(186, 230, 253, 0.6)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
            }}
          />
          
          {isBreathing && (
            <div className="absolute text-center z-10 px-6 animate-fade-in">
              <p className="text-2xl font-bold mb-4 text-sky-900">
                {breathingIn ? "Breathe with the clouds..." : "Floating free..."}
              </p>
              <p className="text-sm text-sky-700/70">
                Cycle {cyclesComplete + 1} of {Math.ceil(totalCycles)}
              </p>
            </div>
          )}

          {!isBreathing && !showAffirmation && (
            <div className="absolute text-center z-10 animate-fade-in">
              <p className="text-lg text-sky-900/70 mb-2">Like soft clouds drifting...</p>
              <p className="text-sm text-sky-700/60">Light and peaceful</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!isBreathing && !showAffirmation ? (
            <Button
              onClick={startBreathing}
              className="w-full text-lg py-6 bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500"
              size="lg"
            >
              Float with the Clouds ✨
            </Button>
          ) : isBreathing ? (
            <Button onClick={() => setIsBreathing(false)} variant="outline" className="w-full">
              Pause
            </Button>
          ) : null}

          <Button variant="ghost" onClick={() => setSoundEnabled(!soundEnabled)} className="w-full">
            {soundEnabled ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />}
            Gentle Wind {soundEnabled ? 'On' : 'Off'}
          </Button>
        </div>

        {showAffirmation && (
          <Card className="p-8 bg-gradient-to-br from-sky-100 to-blue-100 border-2 border-sky-400 animate-scale-in text-center space-y-4">
            <div className="text-5xl mb-4">☁️✨</div>
            <p className="text-xl font-bold text-sky-900">
              Your worries drift away, like clouds in the breeze
            </p>
            <p className="text-sky-700">You feel lighter and calmer now!</p>
            <div className="pt-4 space-y-2">
              <Button onClick={() => navigate('/child/journal-entry')} variant="default" className="w-full">
                Write about how you feel 📝
              </Button>
              <Button onClick={() => navigate('/child/tools/breathing-space')} variant="outline" className="w-full">
                Try another breathing world
              </Button>
            </div>
          </Card>
        )}

        {!showAffirmation && (
          <Card className="p-4 bg-sky-50/50">
            <p className="text-sm text-sky-900/70 text-center">
              ☁️ Your breath is as light as a cloud, floating gently through the sky
            </p>
          </Card>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
