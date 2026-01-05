import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bell } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';

export default function GentleReminderBell() {
  const navigate = useNavigate();
  const [isRinging, setIsRinging] = useState(false);
  const [ringCount, setRingCount] = useState(0);

  const handleRing = () => {
    setIsRinging(true);
    setRingCount(prev => prev + 1);
    
    // Play a simple chime sound (browser-based)
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5 note
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);

    setTimeout(() => {
      setIsRinging(false);
    }, 1500);
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
            Gentle Reminder Bell 🔔
          </h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Ring the bell when you need a moment of calm
        </p>

        <Card className="p-12 text-center space-y-8 min-h-[500px] flex flex-col items-center justify-center">
          <div className="relative">
            <Button
              onClick={handleRing}
              disabled={isRinging}
              className="h-40 w-40 rounded-full text-7xl hover:scale-110 transition-all duration-300 shadow-soft-lg"
              size="lg"
            >
              <Bell 
                className={`h-24 w-24 transition-all duration-500 ${
                  isRinging ? 'animate-[swing_0.5s_ease-in-out]' : ''
                }`}
              />
            </Button>
            
            {isRinging && (
              <>
                <div className="absolute inset-0 rounded-full bg-interactive-accent/20 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-interactive-accent/10 animate-pulse" />
              </>
            )}
          </div>

          <div className="space-y-4">
            {!isRinging && ringCount === 0 && (
              <p className="text-lg text-muted-foreground font-medium">
                Tap the bell to hear its gentle sound
              </p>
            )}
            
            {isRinging && (
              <div className="animate-fade-in space-y-2">
                <h2 className="text-2xl font-bold">
                  Breathe in... breathe out...
                </h2>
                <p className="text-muted-foreground">
                  Listen to the calm sound 🎵
                </p>
              </div>
            )}

            {!isRinging && ringCount > 0 && (
              <p className="text-muted-foreground">
                Ring the bell again whenever you need peace
              </p>
            )}
          </div>

          {ringCount > 0 && (
            <div className="text-sm text-muted-foreground">
              You've rung the bell {ringCount} {ringCount === 1 ? 'time' : 'times'} 🔔
            </div>
          )}
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5">
          <p className="text-sm text-muted-foreground text-center font-medium">
            💡 This bell is just for you. It's a gentle reminder to pause, breathe, and find your calm.
          </p>
        </Card>

        <div className="mt-4">
          <DisclaimerCard variant="tool-limitation" size="small" />
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}

// Add the swing animation to global CSS or use inline styles
const swingAnimation = `
@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}
`;
