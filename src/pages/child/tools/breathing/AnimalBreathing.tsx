import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AnimalType = 'lion' | 'bunny' | 'whale';

const animals = {
  lion: {
    emoji: '🦁',
    name: 'Lion',
    color: 'from-amber-400/30 to-orange-400/30',
    breathIn: 'Breathe in deep like a strong lion',
    breathOut: 'ROAR out all your worries!',
    affirmation: "You're brave like a lion 🦁",
    timing: { in: 4000, out: 4000 }
  },
  bunny: {
    emoji: '🐰',
    name: 'Bunny',
    color: 'from-pink-300/30 to-rose-300/30',
    breathIn: 'Quick bunny sniff in',
    breathOut: 'Gentle bunny breath out',
    affirmation: "You're light like a bunny 🐰",
    timing: { in: 2000, out: 3000 }
  },
  whale: {
    emoji: '🐋',
    name: 'Whale',
    color: 'from-blue-400/30 to-cyan-400/30',
    breathIn: 'Deep ocean breath like a whale',
    breathOut: 'Blow out like a whale spout!',
    affirmation: "You're peaceful like a whale 🐋",
    timing: { in: 5000, out: 5000 }
  }
};

export default function AnimalBreathing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<AnimalType>('bunny');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const currentAnimal = animals[animal];
  const totalCycles = 6;

  useEffect(() => {
    if (!isBreathing) return;
    const timing = breathingIn ? currentAnimal.timing.in : currentAnimal.timing.out;
    const timer = setTimeout(() => {
      setBreathingIn(!breathingIn);
      if (!breathingIn) setCyclesComplete(prev => prev + 1);
    }, timing);
    return () => clearTimeout(timer);
  }, [isBreathing, breathingIn, currentAnimal]);

  useEffect(() => {
    if (cyclesComplete >= totalCycles && isBreathing) {
      completeExercise();
    }
  }, [cyclesComplete, isBreathing]);

  const completeExercise = async () => {
    setIsBreathing(false);
    setShowAffirmation(true);
    if (user) {
      await supabase.from('tool_usage').insert({
        user_id: user.id,
        tool_name: `${currentAnimal.name} Breathing`,
        duration_minutes: 2,
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
    <div className="min-h-screen bg-gradient-to-b from-warm/20 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Animal Breaths 🐾</h1>
        </div>

        {!isBreathing && !showAffirmation && (
          <Card className="p-6 bg-white/60 backdrop-blur animate-fade-in">
            <h3 className="font-bold mb-4 text-center">Which animal do you want to breathe with?</h3>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(animals) as AnimalType[]).map((a) => (
                <Button
                  key={a}
                  variant={animal === a ? 'default' : 'outline'}
                  onClick={() => setAnimal(a)}
                  className="flex flex-col h-auto py-6"
                >
                  <span className="text-4xl mb-2">{animals[a].emoji}</span>
                  <span className="text-xs">{animals[a].name}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}

        <div className="relative flex items-center justify-center min-h-[450px]">
          <div
            className={`absolute rounded-full bg-gradient-to-br ${currentAnimal.color} transition-all ease-in-out ${
              isBreathing
                ? breathingIn
                  ? animal === 'bunny' 
                    ? 'w-56 h-56 opacity-60 duration-[2000ms]'
                    : animal === 'whale'
                    ? 'w-96 h-96 opacity-70 duration-[5000ms]'
                    : 'w-80 h-80 opacity-65 duration-[4000ms]'
                  : animal === 'bunny'
                  ? 'w-32 h-32 opacity-30 duration-[3000ms]'
                  : animal === 'whale'
                  ? 'w-48 h-48 opacity-25 duration-[5000ms]'
                  : 'w-40 h-40 opacity-30 duration-[4000ms]'
                : 'w-64 h-64 opacity-50 duration-1000'
            }`}
            style={{ boxShadow: '0 0 80px rgba(251, 146, 60, 0.4)' }}
          />

          <div className="absolute text-8xl z-20 animate-scale-in">
            {currentAnimal.emoji}
          </div>
          
          {isBreathing && (
            <div className="absolute bottom-0 text-center z-10 px-6 animate-fade-in">
              <p className="text-xl font-bold mb-2">
                {breathingIn ? currentAnimal.breathIn : currentAnimal.breathOut}
              </p>
              <p className="text-sm text-muted-foreground">
                Cycle {cyclesComplete + 1} of {totalCycles}
              </p>
            </div>
          )}

          {!isBreathing && !showAffirmation && (
            <div className="absolute bottom-0 text-center z-10 animate-fade-in px-6">
              <p className="text-sm text-muted-foreground">
                Ready to breathe with the {currentAnimal.name.toLowerCase()}?
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!isBreathing && !showAffirmation ? (
            <Button
              onClick={startBreathing}
              className="w-full text-lg py-6"
              size="lg"
            >
              Start {currentAnimal.name} Breathing ✨
            </Button>
          ) : isBreathing ? (
            <Button onClick={() => setIsBreathing(false)} variant="outline" className="w-full">
              Pause
            </Button>
          ) : null}

          <Button variant="ghost" onClick={() => setSoundEnabled(!soundEnabled)} className="w-full">
            {soundEnabled ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />}
            Animal Sounds {soundEnabled ? 'On' : 'Off'}
          </Button>
        </div>

        {showAffirmation && (
          <Card className="p-8 bg-gradient-to-br from-warm/30 to-dustyRose/30 border-2 border-warm animate-scale-in text-center space-y-4">
            <div className="text-6xl mb-4">{currentAnimal.emoji}✨</div>
            <p className="text-xl font-bold">{currentAnimal.affirmation}</p>
            <p className="text-muted-foreground">You did an amazing job breathing!</p>
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
          <Card className="p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground text-center">
              🐾 Each animal has its own special breathing rhythm. Try them all!
            </p>
          </Card>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
