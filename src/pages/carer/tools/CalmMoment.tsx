import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, Hand, Sparkles, Lock } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

type Mode = 'quick' | 'tapping' | 'stillness';

const modes = {
  quick: {
    name: 'Quick Reset',
    description: '1-minute breath + hand on heart',
    icon: Heart,
    color: 'hsl(25, 60%, 70%)',
    duration: 60,
    isComingSoon: false,
  },
  tapping: {
    name: 'Release Tension',
    description: 'EFT tapping points with gentle guidance',
    icon: Hand,
    color: 'hsl(280, 50%, 75%)',
    duration: 120,
    isComingSoon: true,
    comingSoonLabel: 'Coming Soon',
  },
  stillness: {
    name: 'Find Stillness',
    description: 'Breathing + affirmation sequence',
    icon: Sparkles,
    color: 'hsl(200, 60%, 75%)',
    duration: 90,
    isComingSoon: false,
  },
};

const affirmations = [
  "You're doing your best — and that's enough.",
  "Calm is contagious. Your steadiness matters.",
  "It's okay to pause and take a breath.",
  "Your presence matters more than perfection.",
  "Small moments create lasting safety.",
  "You are your child's safe harbour.",
  "Rest is not selfish — it's essential.",
  "One breath at a time. You've got this.",
];

const tappingPoints = [
  { name: 'Side of Hand', instruction: 'Tap gently while acknowledging: "Even though I feel stressed, I accept myself"' },
  { name: 'Eyebrow', instruction: 'Tap at the beginning of your eyebrow with gentle pressure' },
  { name: 'Side of Eye', instruction: 'Tap on the bone at the side of your eye — breathe slowly' },
  { name: 'Under Eye', instruction: "Tap on the bone under your eye — you're doing well" },
  { name: 'Under Nose', instruction: 'Tap between your nose and upper lip — release tension' },
  { name: 'Chin', instruction: 'Tap in the crease of your chin — let it go' },
  { name: 'Collarbone', instruction: 'Tap just below your collarbone — feel your breath' },
  { name: 'Under Arm', instruction: 'Tap about 4 inches below your armpit — almost done' },
];

export default function CalmMoment() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const mode = selectedMode ? modes[selectedMode] : null;

  // Calculate progress percentage
  const progressPercentage = selectedMode 
    ? (currentStep / (selectedMode === 'quick' ? 1 : selectedMode === 'tapping' ? tappingPoints.length : affirmations.length)) * 100 
    : 0;

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
        <Card className="p-8 text-center space-y-6">
          <div className="text-6xl mb-4">🌬️</div>
          <div className="mb-4">
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold">Place your hand on your heart</h3>
          <p className="text-muted-foreground">Breathe slowly and deeply. Feel your chest rise and fall. You are safe in this moment.</p>
          <p className="text-lg italic" style={{ color: mode.color }}>
            "{affirmations[0]}"
          </p>
        </Card>
      );
    }

    if (selectedMode === 'tapping') {
      const point = tappingPoints[currentStep];
      return (
        <Card className="p-8 text-center space-y-6">
          <div className="text-6xl mb-4">👆</div>
          <div className="mb-4">
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Point {currentStep + 1} of {tappingPoints.length}</p>
          </div>
          <h3 className="text-xl font-semibold">{point.name}</h3>
          <p className="text-muted-foreground">{point.instruction}</p>
          <div className="bg-primary/5 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-xs text-muted-foreground">
              💡 EFT tapping helps calm your nervous system through gentle stimulation
            </p>
          </div>
        </Card>
      );
    }

    if (selectedMode === 'stillness') {
      const affirmation = affirmations[currentStep];
      return (
        <Card className="p-8 text-center space-y-6">
          <div className="text-6xl mb-4">✨</div>
          <div className="mb-4">
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Affirmation {currentStep + 1} of {affirmations.length}</p>
          </div>
          <h3 className="text-2xl font-semibold italic">"{affirmation}"</h3>
          <p className="text-sm text-muted-foreground">Breathe this in. You deserve this kindness.</p>
        </Card>
      );
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-warm/20 to-background p-6 pb-24 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center space-y-6">
          <div className="text-5xl">💚</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Well Done</h2>
            <p className="text-muted-foreground leading-relaxed">
              You took time for yourself. That matters. Small moments of calm add up.
            </p>
          </div>
          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💜 Your calm nervous system supports your child's regulation. Taking care of yourself is taking care of them too.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            If you're feeling persistently overwhelmed, it's okay to reach out to your GP or local NHS support services.
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/carer/resources')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Button>
            <Button onClick={() => {
              setCompleted(false);
              setStarted(false);
              setCurrentStep(0);
              setSelectedMode(null);
            }}>
              Try Another
            </Button>
          </div>
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
                  className={`p-6 transition-all ${
                    m.isComingSoon 
                      ? 'opacity-50 cursor-not-allowed bg-muted/30' 
                      : 'cursor-pointer hover:bg-accent/10'
                  }`}
                  onClick={() => !m.isComingSoon && setSelectedMode(modeKey)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: m.isComingSoon ? 'hsl(var(--muted))' : m.color, opacity: 0.3 }}
                    >
                      <Icon size={28} style={{ color: m.isComingSoon ? 'hsl(var(--muted-foreground))' : m.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-lg mb-1 ${m.isComingSoon ? 'text-muted-foreground' : ''}`}>{m.name}</h3>
                        {m.isComingSoon && (
                          <span className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      {!m.isComingSoon && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.floor(m.duration / 60)} min {m.duration % 60 > 0 ? `${m.duration % 60}s` : ''}
                        </p>
                      )}
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
