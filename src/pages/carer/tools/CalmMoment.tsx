import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, Hand, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

type Mode = 'quick' | 'tapping' | 'stillness';

const modes = {
  quick: {
    name: 'Quick Reset',
    description: '1-minute breath + hand on heart',
    icon: Heart,
    color: 'hsl(25, 60%, 70%)',
    duration: 60,
  },
  tapping: {
    name: 'Release Tension',
    description: 'EFT tapping points with gentle guidance',
    icon: Hand,
    color: 'hsl(280, 50%, 75%)',
    duration: 120,
  },
  stillness: {
    name: 'Find Stillness',
    description: 'Breathing + affirmation sequence',
    icon: Sparkles,
    color: 'hsl(200, 60%, 75%)',
    duration: 90,
  },
};

const affirmations = [
  "You're doing your best — and that's enough.",
  'Calm is contagious.',
  "It's okay to pause.",
  'Your presence matters more than perfection.',
  'Small moments create lasting safety.',
];

const tappingPoints = [
  { name: 'Top of head', instruction: 'Gently tap the crown of your head' },
  { name: 'Between eyebrows', instruction: 'Tap between your eyebrows' },
  { name: 'Side of eye', instruction: 'Tap the outer corner of your eye' },
  { name: 'Under eye', instruction: 'Tap under your eye on the cheekbone' },
  { name: 'Under nose', instruction: 'Tap between your nose and upper lip' },
  { name: 'Chin', instruction: 'Tap the center of your chin' },
  { name: 'Collarbone', instruction: 'Tap your collarbone points' },
  { name: 'Under arm', instruction: 'Tap under your arm (about 4 inches below armpit)' },
];

export default function CalmMoment() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const mode = selectedMode ? modes[selectedMode] : null;

  useEffect(() => {
    if (!started || !mode || completed) return;

    let stepDuration = 0;
    if (selectedMode === 'quick') {
      stepDuration = mode.duration * 1000;
    } else if (selectedMode === 'tapping') {
      stepDuration = (mode.duration / tappingPoints.length) * 1000;
    } else if (selectedMode === 'stillness') {
      stepDuration = (mode.duration / affirmations.length) * 1000;
    }

    const timer = setTimeout(() => {
      const maxSteps =
        selectedMode === 'tapping'
          ? tappingPoints.length
          : selectedMode === 'stillness'
            ? affirmations.length
            : 1;

      if (currentStep < maxSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCompleted(true);
      }
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [started, currentStep, mode, selectedMode, completed]);

  const handleStart = () => {
    setStarted(true);
    setCurrentStep(0);
  };

  const renderContent = () => {
    if (!mode || !selectedMode) return null;

    if (selectedMode === 'quick') {
      return (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative w-32 h-32 mx-auto">
            <Heart
              className="absolute inset-0 m-auto animate-pulse"
              size={120}
              style={{ color: mode.color }}
            />
          </div>
          <div className="space-y-4">
            <p className="text-xl font-medium">Place your hand on your heart</p>
            <p className="text-muted-foreground leading-relaxed">
              Breathe slowly and deeply. Feel your chest rise and fall. You are safe in this moment.
            </p>
            <p className="text-lg italic" style={{ color: mode.color }}>
              "{affirmations[0]}"
            </p>
          </div>
        </div>
      );
    }

    if (selectedMode === 'tapping') {
      const point = tappingPoints[currentStep];
      return (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative w-32 h-32 mx-auto">
            <div
              className="absolute inset-0 m-auto w-24 h-24 rounded-full animate-pulse"
              style={{ backgroundColor: mode.color, opacity: 0.3 }}
            />
            <Hand
              className="absolute inset-0 m-auto"
              size={80}
              style={{ color: mode.color }}
            />
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-bold">{point.name}</p>
            <p className="text-lg text-muted-foreground">{point.instruction}</p>
            <p className="text-sm italic">
              As you tap, release any tension you're holding.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Point {currentStep + 1} of {tappingPoints.length}
          </p>
        </div>
      );
    }

    if (selectedMode === 'stillness') {
      const affirmation = affirmations[currentStep];
      return (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative w-32 h-32 mx-auto">
            <div
              className="absolute inset-0 m-auto w-full h-full rounded-full animate-pulse"
              style={{ backgroundColor: mode.color, opacity: 0.2 }}
            />
            <Sparkles
              className="absolute inset-0 m-auto"
              size={80}
              style={{ color: mode.color }}
            />
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-medium leading-relaxed px-4" style={{ color: mode.color }}>
              "{affirmation}"
            </p>
            <p className="text-muted-foreground">Breathe this in. Let it settle.</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {currentStep + 1} of {affirmations.length}
          </p>
        </div>
      );
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm/20 to-background p-6 pb-24 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center space-y-6">
          <div className="text-5xl">✨</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">You Just Took Care of You</h2>
            <p className="text-muted-foreground leading-relaxed">
              Regulating yourself is one of the most powerful things you can do for your child. 
              Your calm becomes their safety.
            </p>
          </div>
          <Button onClick={() => navigate('/carer/resources')} className="w-full">
            Return to Resources
          </Button>
        </Card>
        <BottomNav role="carer" />
      </div>
    );
  }

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm/20 to-background p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/carer/resources')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Calm Moment for You ☀️</h1>
              <p className="text-muted-foreground">Take 1-2 minutes to reset</p>
            </div>
          </div>

          <Card className="p-6">
            <p className="text-sm leading-relaxed">
              You can't pour from an empty cup. These quick tools help you regulate your own nervous system, 
              so you can show up calm and present for your child.
            </p>
          </Card>

          <div className="space-y-4">
            {(Object.keys(modes) as Mode[]).map((modeKey) => {
              const m = modes[modeKey];
              const Icon = m.icon;
              return (
                <Card
                  key={modeKey}
                  className="p-6 cursor-pointer hover:bg-accent/10 transition-all"
                  onClick={() => setSelectedMode(modeKey)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: m.color, opacity: 0.3 }}
                    >
                      <Icon size={28} style={{ color: m.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{m.name}</h3>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.floor(m.duration / 60)} min {m.duration % 60 > 0 ? `${m.duration % 60}s` : ''}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        <BottomNav role="carer" />
      </div>
    );
  }

  if (!started) {
    const Icon = mode!.icon;
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm/20 to-background p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedMode(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{mode!.name}</h1>
              <p className="text-sm text-muted-foreground">{mode!.description}</p>
            </div>
          </div>

          <Card className="p-12 text-center space-y-6">
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: mode!.color, opacity: 0.3 }}
            >
              <Icon size={48} style={{ color: mode!.color }} />
            </div>
            <div>
              <p className="text-muted-foreground">
                Find a comfortable position. This is your time to reset and recharge.
              </p>
            </div>
            <Button onClick={handleStart} size="lg" className="w-full">
              Begin
            </Button>
          </Card>
        </div>
        <BottomNav role="carer" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm/20 to-background p-6 pb-24 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">{renderContent()}</div>
      <BottomNav role="carer" />
    </div>
  );
}
