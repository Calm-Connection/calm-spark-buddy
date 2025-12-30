import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Music, CheckCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const calmActivities = [
  { emoji: '🫧', name: 'Blow bubbles', description: 'Real or imaginary - deep breaths!' },
  { emoji: '🎨', name: 'Colour together', description: 'Quiet colouring side by side' },
  { emoji: '🧸', name: 'Cuddle time', description: 'Snuggle with a soft toy or each other' },
  { emoji: '📖', name: 'Read a story', description: 'Pick a favourite calming book' },
  { emoji: '🎵', name: 'Listen to music', description: 'Put on soothing sounds' },
  { emoji: '🌬️', name: 'Deep breaths', description: 'Breathe in for 4, out for 6' },
  { emoji: '✋', name: 'Hand massage', description: 'Gentle hand rubs are calming' },
  { emoji: '🌈', name: 'Look at colours', description: 'Name 5 colours you can see' },
];

export default function CalmDownCorner() {
  const navigate = useNavigate();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [step, setStep] = useState<'choose' | 'doing' | 'complete'>('choose');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const toggleActivity = (name: string) => {
    if (selectedActivities.includes(name)) {
      setSelectedActivities(selectedActivities.filter(a => a !== name));
    } else if (selectedActivities.length < 3) {
      setSelectedActivities([...selectedActivities, name]);
    }
  };

  const handleStart = () => {
    if (selectedActivities.length > 0) {
      setStep('doing');
    }
  };

  const handleNextActivity = () => {
    if (currentActivityIndex < selectedActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      setStep('complete');
    }
  };

  const handleRestart = () => {
    setStep('choose');
    setSelectedActivities([]);
    setCurrentActivityIndex(0);
  };

  const getCurrentActivity = () => {
    const name = selectedActivities[currentActivityIndex];
    return calmActivities.find(a => a.name === name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm/10 to-background pb-24">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/joint-tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              Calm Down Corner
            </h1>
            <p className="text-muted-foreground text-sm">Create a cosy calm space together</p>
          </div>
        </div>

        {step === 'choose' && (
          <>
            <Card className="relative p-6 bg-gradient-to-br from-warm/10 via-primary/5 to-accent/10 border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="cloud" position="top-right" opacity={0.1} />
              
              <div className="text-center space-y-3">
                <div className="text-5xl">🏠✨</div>
                <h2 className="text-lg font-semibold">Build Your Calm Corner</h2>
                <p className="text-sm text-muted-foreground">
                  Choose up to 3 calming activities to do together
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {calmActivities.map((activity) => (
                <button
                  key={activity.name}
                  onClick={() => toggleActivity(activity.name)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedActivities.includes(activity.name)
                      ? 'bg-primary/20 ring-2 ring-primary scale-[1.02]'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{activity.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleStart} 
              className="w-full"
              disabled={selectedActivities.length === 0}
            >
              Start Calm Corner ({selectedActivities.length}/3 activities)
            </Button>
          </>
        )}

        {step === 'doing' && (
          <>
            <Card className="relative p-6 bg-gradient-to-br from-warm/10 via-primary/5 to-accent/10 border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
              
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  Activity {currentActivityIndex + 1} of {selectedActivities.length}
                </div>
                
                <div className="text-7xl mb-4">{getCurrentActivity()?.emoji}</div>
                
                <h2 className="text-2xl font-bold">{getCurrentActivity()?.name}</h2>
                <p className="text-muted-foreground">{getCurrentActivity()?.description}</p>
                
                <Card className="p-4 bg-muted/30 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Take your time with this activity. There's no rush. 
                    When you're ready, move to the next one.
                  </p>
                </Card>
              </div>
            </Card>

            <Button onClick={handleNextActivity} className="w-full" size="lg">
              {currentActivityIndex < selectedActivities.length - 1 
                ? "Next Activity →" 
                : "Finish Calm Corner ✨"}
            </Button>
          </>
        )}

        {step === 'complete' && (
          <Card className="relative p-8 bg-gradient-to-br from-primary/10 via-accent/15 to-secondary/10 border-interactive-accent/20 shadow-soft-lg text-center">
            <DecorativeIcon icon="sparkles" position="top-right" opacity={0.15} />
            
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 mx-auto text-interactive-accent" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Feeling Calmer? 💜</h2>
                <p className="text-muted-foreground">
                  You've completed your calm down corner together. 
                  Remember, you can create this space anytime you need it.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You did: {selectedActivities.join(', ')}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRestart} className="flex-1">
                  Start Over
                </Button>
                <Button onClick={() => navigate('/carer/joint-tools')} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            💡 Tip: Consider creating a real calm corner in your home with cushions, soft lighting, and calming objects.
          </p>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
