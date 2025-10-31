import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

type BreathingStyle = 'classic' | 'rainbow' | 'animal';
type AnimalType = 'lion' | 'bunny' | 'whale';

export default function BreathingSpace() {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [style, setStyle] = useState<BreathingStyle>('classic');
  const [animal, setAnimal] = useState<AnimalType>('bunny');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const affirmations = [
    "You did it — your body feels a little calmer now 💙",
    "Amazing! You're learning to control your breathing 🌟",
    "Well done! Your mind and body feel more peaceful ✨",
    "Great job! You're getting better at staying calm 🌈"
  ];

  const animalInstructions = {
    lion: { in: "Breathe in deep like a strong lion 🦁", out: "ROAR out all your worries!" },
    bunny: { in: "Quick bunny sniff in 🐰", out: "Gentle bunny breath out" },
    whale: { in: "Deep ocean breath like a whale 🐋", out: "Blow out like a whale spout!" }
  };

  useEffect(() => {
    if (!isBreathing) return;

    const breathCycle = breathingIn ? 4000 : 4000; // 4 seconds in, 4 seconds out
    const timer = setTimeout(() => {
      setBreathingIn(!breathingIn);
      if (!breathingIn) {
        setCyclesComplete(prev => prev + 1);
      }
    }, breathCycle);

    return () => clearTimeout(timer);
  }, [isBreathing, breathingIn]);

  useEffect(() => {
    if (cyclesComplete >= 5 && isBreathing) {
      setIsBreathing(false);
      setShowAffirmation(true);
      setTimeout(() => setShowAffirmation(false), 5000);
    }
  }, [cyclesComplete, isBreathing]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingIn(true);
    setCyclesComplete(0);
    setShowAffirmation(false);
  };

  const getInstruction = () => {
    if (style === 'animal') {
      return breathingIn ? animalInstructions[animal].in : animalInstructions[animal].out;
    }
    return breathingIn ? "Breathe in... slowly fill your lungs" : "Breathe out... let it all go";
  };

  const getCircleColor = () => {
    if (style === 'rainbow') {
      const colors = ['from-primary to-secondary', 'from-secondary to-accent', 'from-accent to-warm', 'from-warm to-dustyRose', 'from-dustyRose to-primary'];
      return colors[cyclesComplete % colors.length];
    }
    return 'from-primary/30 to-secondary/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Breathing Space 🌬️</h1>
        </div>

        {/* Style Selector */}
        {!isBreathing && (
          <Card className="p-6 bg-gradient-to-br from-accent/20 to-warm/20">
            <h3 className="font-bold mb-4">Choose Your Breathing Style</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={style === 'classic' ? 'default' : 'outline'}
                onClick={() => setStyle('classic')}
                className="flex flex-col h-auto py-4"
              >
                <span className="text-2xl mb-1">🌊</span>
                <span className="text-xs">Classic</span>
              </Button>
              <Button
                variant={style === 'rainbow' ? 'default' : 'outline'}
                onClick={() => setStyle('rainbow')}
                className="flex flex-col h-auto py-4"
              >
                <span className="text-2xl mb-1">🌈</span>
                <span className="text-xs">Rainbow</span>
              </Button>
              <Button
                variant={style === 'animal' ? 'default' : 'outline'}
                onClick={() => setStyle('animal')}
                className="flex flex-col h-auto py-4"
              >
                <span className="text-2xl mb-1">🐾</span>
                <span className="text-xs">Animal</span>
              </Button>
            </div>

            {style === 'animal' && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(['lion', 'bunny', 'whale'] as AnimalType[]).map((a) => (
                  <Button
                    key={a}
                    variant={animal === a ? 'secondary' : 'ghost'}
                    onClick={() => setAnimal(a)}
                    className="text-2xl"
                  >
                    {a === 'lion' ? '🦁' : a === 'bunny' ? '🐰' : '🐋'}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center min-h-[400px]">
          <div
            className={`absolute rounded-full bg-gradient-to-br ${getCircleColor()} transition-all duration-[4000ms] ease-in-out ${
              isBreathing
                ? breathingIn
                  ? 'w-64 h-64 opacity-70'
                  : 'w-32 h-32 opacity-30'
                : 'w-48 h-48 opacity-50'
            }`}
            style={{ boxShadow: '0 0 60px rgba(163, 153, 220, 0.4)' }}
          />
          
          {isBreathing && (
            <div className="absolute text-center z-10 px-6">
              <p className="text-xl font-bold mb-2">{getInstruction()}</p>
              <p className="text-sm text-muted-foreground">Cycle {cyclesComplete + 1} of 5</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isBreathing ? (
            <Button
              onClick={startBreathing}
              className="w-full text-lg py-6"
              size="lg"
            >
              Start Breathing Exercise ✨
            </Button>
          ) : (
            <Button
              onClick={() => setIsBreathing(false)}
              variant="outline"
              className="w-full"
            >
              Pause
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full"
          >
            {soundEnabled ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </Button>
        </div>

        {/* Affirmation */}
        {showAffirmation && (
          <Card className="p-6 bg-gradient-to-br from-secondary/30 to-accent/30 border-2 border-secondary animate-scale-in">
            <p className="text-center text-lg font-bold">
              {affirmations[Math.floor(Math.random() * affirmations.length)]}
            </p>
          </Card>
        )}

        {/* Info */}
        <Card className="p-4 bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            💡 Breathing slowly helps calm your mind and body. Try it whenever you feel worried or upset.
          </p>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
