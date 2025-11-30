import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Volume2, VolumeX, Repeat } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

type Theme = 'ocean' | 'forest' | 'sky';
type LeaderMode = 'parent' | 'child';

const themes = {
  ocean: {
    name: 'Ocean',
    gradient: 'from-blue-400/20 to-cyan-300/20',
    color: 'hsl(200, 70%, 60%)',
    icon: '🌊',
  },
  forest: {
    name: 'Forest',
    gradient: 'from-green-400/20 to-emerald-300/20',
    color: 'hsl(142, 50%, 45%)',
    icon: '🌲',
  },
  sky: {
    name: 'Sky',
    gradient: 'from-purple-400/20 to-pink-300/20',
    color: 'hsl(280, 50%, 70%)',
    icon: '☁️',
  },
};

export default function BreathingTogether() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<Theme>('ocean');
  const [leaderMode, setLeaderMode] = useState<LeaderMode>('parent');
  const [started, setStarted] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const totalCycles = 5;

  useEffect(() => {
    if (!started || completed) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          if (phase === 'inhale') {
            setPhase('exhale');
            return 4;
          } else {
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1200); // Slower 1.2s interval for calming NHS pace

    return () => clearInterval(interval);
  }, [started, phase, completed]);

  useEffect(() => {
    if (cycleCount >= totalCycles) {
      setCompleted(true);
    }
  }, [cycleCount]);

  const currentTheme = themes[selectedTheme];
  const scale = phase === 'inhale' ? 1.5 : 1;

  if (!started) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentTheme.gradient} to-background p-6 pb-24`}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/carer/resources')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Breathing Together 🫶</h1>
              <p className="text-muted-foreground">Co-regulation through shared breath</p>
            </div>
          </div>

          <Card className="relative p-6 space-y-4 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
            <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
            <p className="text-sm leading-relaxed">
              <strong>Your calm helps theirs.</strong> When you breathe together, your nervous systems sync — 
              this is called co-regulation. Your child feels safety through your presence.
            </p>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-3">Choose a Theme</h2>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(themes) as Theme[]).map((theme) => (
                <Card
                  key={theme}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-soft ${
                    selectedTheme === theme ? 'ring-2 ring-interactive-accent border-interactive-accent/30' : 'hover:bg-accent/10 border-interactive-accent/10'
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{themes[theme].icon}</div>
                    <p className="text-sm font-medium">{themes[theme].name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Who Leads?</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  leaderMode === 'parent' ? 'ring-2 ring-primary' : 'hover:bg-accent/10'
                }`}
                onClick={() => setLeaderMode('parent')}
              >
                <div className="text-center">
                  <p className="font-medium">Parent Leads</p>
                  <p className="text-xs text-muted-foreground mt-1">You guide the rhythm</p>
                </div>
              </Card>
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  leaderMode === 'child' ? 'ring-2 ring-primary' : 'hover:bg-accent/10'
                }`}
                onClick={() => setLeaderMode('child')}
              >
                <div className="text-center">
                  <p className="font-medium">Child Leads</p>
                  <p className="text-xs text-muted-foreground mt-1">They set the pace</p>
                </div>
              </Card>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={() => setStarted(true)}>
            Begin Together
          </Button>
        </div>
        <BottomNav role="carer" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentTheme.gradient} to-background p-6 pb-24 flex items-center justify-center`}>
        <Card className="p-8 max-w-md mx-auto text-center space-y-6">
          <div className="text-5xl">✨</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Beautiful Work!</h2>
            <p className="text-muted-foreground leading-relaxed">
              You've completed 5 cycles of co-regulation breathing together. 
              This shared calm moment helps you both feel more connected and safe.
            </p>
          </div>
          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💜 <strong>Co-regulation works:</strong> Your calm nervous system helps your child's nervous system find calm too. You're doing wonderfully.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/carer/resources')} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Button>
            <Button
              onClick={() => {
                setStarted(false);
                setCompleted(false);
                setCycleCount(0);
                setPhase('inhale');
                setCount(4);
              }}
              className="flex-1"
            >
              <Repeat className="h-4 w-4 mr-2" />
              Breathe Again
            </Button>
          </div>
        </Card>
        <BottomNav role="carer" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.gradient} to-background relative overflow-hidden`}>
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate('/carer/resources')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setSoundOn(!soundOn)}>
          {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
        <Badge variant="secondary" className="mb-4">
          Cycle {cycleCount + 1} of {totalCycles}
        </Badge>

        {/* Animated breathing circles */}
        <div className="flex justify-center gap-12 mb-8">
          {/* Parent circle */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-32 h-32 rounded-full transition-all duration-[1200ms] ease-in-out shadow-lg"
              style={{
                backgroundColor: currentTheme.color,
                transform: phase === 'inhale' ? 'scale(1.3)' : 'scale(0.9)',
                opacity: phase === 'inhale' ? 1 : 0.7,
                boxShadow: phase === 'inhale' ? `0 0 30px ${currentTheme.color}` : 'none'
              }}
            />
            <span className="text-sm font-medium">Parent</span>
          </div>

          {/* Child circle */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-32 h-32 rounded-full transition-all duration-[1200ms] ease-in-out shadow-lg"
              style={{
                backgroundColor: currentTheme.color,
                transform: phase === 'inhale' ? 'scale(1.3)' : 'scale(0.9)',
                opacity: phase === 'inhale' ? 1 : 0.7,
                boxShadow: phase === 'inhale' ? `0 0 30px ${currentTheme.color}` : 'none'
              }}
            />
            <span className="text-sm font-medium">Child</span>
          </div>
        </div>

        <div className="text-center space-y-4 mt-8">
          <p className="text-6xl font-bold" style={{ color: currentTheme.color }}>
            {count}
          </p>
          <p className="text-2xl font-medium capitalize">{phase}</p>
          <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
            {phase === 'inhale' 
              ? "Breathe in slowly together... filling your lungs gently..."
              : "Now breathe out slowly... letting go of any tension..."}
          </p>
        </div>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
