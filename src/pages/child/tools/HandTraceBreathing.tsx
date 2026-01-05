import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';

export default function HandTraceBreathing() {
  const navigate = useNavigate();
  const [currentFinger, setCurrentFinger] = useState(0);
  const [isInhaling, setIsInhaling] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  const breathDuration = 4000; // 4 seconds per breath phase

  useEffect(() => {
    if (!isActive || isComplete) return;

    const timer = setTimeout(() => {
      if (isInhaling) {
        setIsInhaling(false);
      } else {
        if (currentFinger < fingers.length - 1) {
          setCurrentFinger(currentFinger + 1);
          setIsInhaling(true);
        } else {
          setIsComplete(true);
        }
      }
    }, breathDuration);

    return () => clearTimeout(timer);
  }, [isActive, isInhaling, currentFinger, isComplete]);

  const handleStart = () => {
    setIsActive(true);
    setIsComplete(false);
    setCurrentFinger(0);
    setIsInhaling(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsComplete(false);
    setCurrentFinger(0);
    setIsInhaling(true);
  };

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
            Hand Trace Breathing ✋
          </h1>
        </div>

        {!isActive && !isComplete && (
          <>
            <p className="text-muted-foreground font-medium">
              Trace your fingers slowly. Breathe in going up, breathe out going down.
            </p>
            <Card className="p-8 text-center space-y-4">
              <div className="text-8xl">✋</div>
              <p className="text-muted-foreground">
                Get ready to trace each finger and breathe calmly
              </p>
            </Card>
            <Button onClick={handleStart} className="w-full" size="lg">
              Start Breathing
            </Button>
          </>
        )}

        {isActive && !isComplete && (
          <>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-medium">
                Finger {currentFinger + 1} of {fingers.length}
              </p>
              <h2 className="text-2xl font-bold">
                {isInhaling ? 'Breathe In 👃' : 'Breathe Out 💨'}
              </h2>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 relative overflow-hidden min-h-[400px] flex items-center justify-center">
              <div className="relative">
                <div className="text-9xl opacity-20">✋</div>
                <div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                >
                  <div 
                    className={`w-16 h-16 rounded-full bg-interactive-accent shadow-soft-lg transition-all duration-1000 ${
                      isInhaling ? 'scale-150' : 'scale-100'
                    }`}
                    style={{
                      animation: isInhaling ? 'pulse 2s ease-in-out' : 'none'
                    }}
                  />
                </div>
              </div>
            </Card>

            <div className="flex gap-2 justify-center">
              {fingers.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index < currentFinger 
                      ? 'bg-interactive-accent' 
                      : index === currentFinger
                      ? 'bg-interactive-accent/50'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {isComplete && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
              <div className="text-6xl">✨</div>
              <h2 className="text-2xl font-bold">
                Well Done! 🌟
              </h2>
              <p className="text-muted-foreground font-medium">
                You completed 5 calm breaths. Notice how you feel now.
              </p>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Breathe Again
              </Button>
              <Button 
                onClick={() => navigate('/child/tools')}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4">
          <DisclaimerCard variant="tool-limitation" size="small" />
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
