import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eye, Hand, Ear, Droplet, Apple, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';

type Step = 'intro' | 'see' | 'touch' | 'hear' | 'smell' | 'taste' | 'complete';

const steps = [
  { id: 'see', count: 5, icon: Eye, prompt: "Can you find 5 things you can see?", color: 'from-primary/20 to-secondary/20' },
  { id: 'touch', count: 4, icon: Hand, prompt: "Now find 4 things you can touch", color: 'from-secondary/20 to-accent/20' },
  { id: 'hear', count: 3, icon: Ear, prompt: "Listen carefully... 3 things you can hear?", color: 'from-accent/20 to-warm/20' },
  { id: 'smell', count: 2, icon: Droplet, prompt: "Take a breath... 2 things you can smell?", color: 'from-warm/20 to-dustyRose/20' },
  { id: 'taste', count: 1, icon: Apple, prompt: "And finally... 1 thing you can taste?", color: 'from-dustyRose/20 to-primary/20' },
];

const sampleObjects = {
  see: ['🌈', '⭐', '🌸', '🦋', '🌙', '☁️', '🌻', '🎨'],
  touch: ['🪨', '🧸', '🌿', '📚', '🎈', '🧩'],
  hear: ['🎵', '🐦', '🌊', '🔔', '🎶'],
  smell: ['🌺', '🍋', '☕', '🌲'],
  taste: ['🍎', '🍯']
};

export default function GroundingGame() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [selectedItems, setSelectedItems] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const getCurrentStepData = () => steps.find(s => s.id === currentStep);

  const startGame = () => {
    setCurrentStep('see');
    setSelectedItems(0);
    setCompletedSteps([]);
  };

  const handleItemClick = () => {
    const stepData = getCurrentStepData();
    if (!stepData) return;

    const newCount = selectedItems + 1;
    setSelectedItems(newCount);

    if (newCount >= stepData.count) {
      setTimeout(() => {
        setCompletedSteps([...completedSteps, currentStep]);
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex < steps.length - 1) {
          setCurrentStep(steps[currentIndex + 1].id as Step);
          setSelectedItems(0);
        } else {
          setCurrentStep('complete');
        }
      }, 800);
    }
  };

  const stepData = getCurrentStepData();
  const Icon = stepData?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">5-4-3-2-1 Grounding Game 🌍</h1>
        </div>

        {currentStep === 'intro' && (
          <div className="space-y-6">
            <Card className="relative p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
              <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-interactive-accent bg-clip-text text-transparent">Let's play a calming game!</h2>
              <p className="text-muted-foreground mb-4">
                This game helps you feel calm by noticing the world around you. 
                We'll use all your senses — seeing, touching, hearing, smelling, and tasting.
              </p>
              <p className="font-bold">Ready? Let's begin! ✨</p>
            </Card>

            <Button onClick={startGame} className="w-full text-lg py-6" size="lg">
              Start the Game 🎮
            </Button>

            <Card className="p-4 bg-muted/20">
              <p className="text-sm text-center text-muted-foreground">
                💡 This game helps when you feel worried or overwhelmed. It brings you back to the present moment.
              </p>
            </Card>
          </div>
        )}

        {currentStep !== 'intro' && currentStep !== 'complete' && stepData && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex justify-center gap-2">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition-all ${
                    completedSteps.includes(step.id)
                      ? 'w-12 bg-secondary'
                      : step.id === currentStep
                      ? 'w-16 bg-primary'
                      : 'w-8 bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Current Step */}
            <Card className={`p-8 bg-gradient-to-br ${stepData.color} text-center`}>
              {Icon && <Icon className="w-16 h-16 mx-auto mb-4 text-primary" />}
              <h2 className="text-2xl font-bold mb-2">{stepData.prompt}</h2>
              <p className="text-4xl font-bold text-primary">
                {selectedItems} / {stepData.count}
              </p>
            </Card>

            {/* Interactive Objects */}
            <div className="grid grid-cols-4 gap-4 min-h-[200px]">
              {sampleObjects[currentStep as keyof typeof sampleObjects]?.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={handleItemClick}
                  disabled={selectedItems >= stepData.count}
                  className="text-5xl hover:scale-125 transition-transform duration-300 disabled:opacity-50"
                  style={{
                    animation: `float-slow ${4 + idx}s ease-in-out infinite`,
                    animationDelay: `${idx * 0.5}s`
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <p className="text-center text-muted-foreground">
              Tap the objects as you notice them around you ✨
            </p>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-secondary/30 to-accent/30 text-center border-2 border-secondary">
              <Sparkles className="w-20 h-20 mx-auto mb-4 text-primary animate-gentle-pulse" />
              <h2 className="text-2xl font-bold mb-3">Amazing Work! 🌟</h2>
              <p className="text-lg mb-4">
                You're safe. You're here. You did a great job grounding yourself.
              </p>
              <p className="text-muted-foreground">
                Notice how your body feels a little calmer now? That's the power of staying present! 💙
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={startGame} variant="outline">
                Play Again ↻
              </Button>
              <Button onClick={() => navigate('/child/tools')}>
                Back to Tools
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <DisclaimerCard variant="tool-limitation" size="small" />
      </div>

      <BottomNav role="child" />
    </div>
  );
}
