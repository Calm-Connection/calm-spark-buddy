import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { WendyTipCard } from '@/components/WendyTipCard';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';

const activities = [
  { id: 1, name: 'Sensory Reset', emoji: '👁️', instruction: 'Name 3 things you can see right now', color: 'from-pink-300 to-pink-400' },
  { id: 2, name: 'Quick Breathing', emoji: '🫁', instruction: 'Take 3 slow, deep breaths', color: 'from-blue-300 to-blue-400' },
  { id: 3, name: 'Kind Thought', emoji: '💭', instruction: 'Think of something kind about yourself', color: 'from-purple-300 to-purple-400' },
  { id: 4, name: 'Small Movement', emoji: '🤸', instruction: 'Do 5 gentle arm circles', color: 'from-green-300 to-green-400' },
  { id: 5, name: 'Gratitude Spark', emoji: '✨', instruction: 'Name one thing you\'re grateful for today', color: 'from-amber-300 to-amber-400' },
];

export default function CalmWheel() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    setIsDone(false);
    
    setTimeout(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setSelectedActivity(randomActivity);
      setIsSpinning(false);
    }, 2000);
  };

  const handleComplete = () => {
    setIsDone(true);
  };

  const handleSpinAgain = () => {
    setSelectedActivity(null);
    setIsDone(false);
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
            Spin the Calm Wheel 🎡
          </h1>
        </div>

        {!selectedActivity && !isSpinning && (
          <>
            <p className="text-muted-foreground font-medium">
              Spin the wheel for a quick calming activity
            </p>

            <Card className="p-8 text-center space-y-6">
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-secondary opacity-20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-card border-4 border-border flex items-center justify-center">
                  <div className="text-6xl">🎡</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                Each activity takes 10-20 seconds
              </p>
            </Card>

            <Button onClick={handleSpin} className="w-full" size="lg">
              <RotateCw className="mr-2 h-5 w-5" />
              Spin the Wheel
            </Button>
          </>
        )}

        {isSpinning && (
          <Card className="p-8 text-center space-y-6 min-h-[400px] flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mx-auto">
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-secondary animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-4 rounded-full bg-card border-4 border-border flex items-center justify-center">
                <div className="text-6xl animate-spin" style={{ animationDuration: '0.5s' }}>🎡</div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium">Spinning...</p>
          </Card>
        )}

        {selectedActivity && !isDone && (
          <div className="space-y-6 animate-fade-in">
            <Card className={`p-8 bg-gradient-to-br ${selectedActivity.color} text-center space-y-4`}>
              <div className="text-8xl">{selectedActivity.emoji}</div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {selectedActivity.name}
              </h2>
              <p className="text-lg text-white/90 font-medium">
                {selectedActivity.instruction}
              </p>
            </Card>

            <Button onClick={handleComplete} className="w-full" size="lg">
              I'm Done!
            </Button>
          </div>
        )}

        {isDone && selectedActivity && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
              <div className="text-6xl">✨</div>
              <h2 className="text-2xl font-bold">
                Great Job!
              </h2>
              <p className="text-muted-foreground font-medium">
                You completed: {selectedActivity.name}
              </p>
            </Card>

            <WendyTipCard tip="These quick activities are perfect when you need a fast reset. Even 20 seconds can make a big difference! 🌟" />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleSpinAgain}
                className="flex-1"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Spin Again
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
