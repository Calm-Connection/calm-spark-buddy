import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

export default function SlowMoMode() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setIsComplete(false);
    setTimeLeft(10);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsComplete(false);
    setTimeLeft(10);
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
            Slow Mo Mode 🐢
          </h1>
        </div>

        {!isActive && !isComplete && (
          <>
            <p className="text-muted-foreground font-medium">
              Everything will slow down for 10 seconds. Take slow, deep breaths.
            </p>

            <Card className="p-8 text-center space-y-6">
              <div className="text-8xl">🐢</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Ready to Slow Down?</h2>
                <p className="text-muted-foreground">
                  When you start, breathe slowly and calmly
                </p>
              </div>
            </Card>

            <Button onClick={handleStart} className="w-full" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Start Slow Mo Mode
            </Button>
          </>
        )}

        {isActive && (
          <div className="space-y-6 animate-fade-in">
            <Card 
              className="p-12 text-center space-y-8 min-h-[500px] flex flex-col items-center justify-center"
              style={{
                filter: 'blur(0.5px)',
                transition: 'all 2s ease-in-out'
              }}
            >
              <div 
                className="text-9xl transition-all duration-2000"
                style={{
                  animation: 'pulse 4s ease-in-out infinite'
                }}
              >
                🐢
              </div>
              
              <div className="space-y-4">
                <div className="text-7xl font-bold text-interactive-accent">
                  {timeLeft}
                </div>
                <h2 className="text-2xl font-bold opacity-80">
                  Breathe... slowly...
                </h2>
                <p className="text-lg text-muted-foreground opacity-60">
                  Everything is slowing down...
                </p>
              </div>

              <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-interactive-accent transition-all duration-1000"
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            </Card>
          </div>
        )}

        {isComplete && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
              <div className="text-6xl">✨</div>
              <h2 className="text-2xl font-bold">
                Back to Normal Speed
              </h2>
              <p className="text-muted-foreground font-medium">
                Notice how you feel now. Are you calmer?
              </p>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Try Again
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
      </div>

      <BottomNav role="child" />
    </div>
  );
}
