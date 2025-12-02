import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const resetSteps = [
  { id: 1, action: 'Wiggle Toes', emoji: '👣', instruction: 'Wiggle your toes - left, right, all together!' },
  { id: 2, action: 'Shake Hands', emoji: '🙌', instruction: 'Shake your hands like you\'re drying them' },
  { id: 3, action: 'Stretch Arms', emoji: '💪', instruction: 'Reach your arms up high and stretch' },
  { id: 4, action: 'Look Around', emoji: '👀', instruction: 'Turn your head left, then right, nice and slow' },
];

export default function WiggleReset() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const isComplete = currentStep >= resetSteps.length;

  const handleNext = () => {
    if (currentStep < resetSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const step = resetSteps[currentStep];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent/5 to-background pb-20">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/child/tools')} 
              className="hover:bg-interactive-accent/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Wiggle Reset ⚡
            </h1>
          </div>

          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h2 className="text-2xl font-bold">
                Reset Complete! ✨
              </h2>
              <p className="text-muted-foreground font-medium">
                You gave your body a quick reset. How do you feel now?
              </p>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Reset Again
              </Button>
              <Button 
                onClick={() => navigate('/child/tools')}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
        <BottomNav role="child" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent/5 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/child/tools')} 
            className="hover:bg-interactive-accent/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Wiggle Reset ⚡
          </h1>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Step {currentStep + 1} of {resetSteps.length}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-6 min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-9xl animate-bounce" style={{ animationDuration: '1.5s' }}>
            {step.emoji}
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{step.action}</h2>
            <p className="text-lg text-muted-foreground font-medium">
              {step.instruction}
            </p>
          </div>
        </Card>

        <Button 
          onClick={handleNext}
          className="w-full"
          size="lg"
        >
          <Check className="mr-2 h-5 w-5" />
          I Did It!
        </Button>

        <div className="flex gap-2 justify-center">
          {resetSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index < currentStep 
                  ? 'bg-interactive-accent' 
                  : index === currentStep
                  ? 'bg-interactive-accent/50'
                  : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
