import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

type Creature = 'firefly' | 'turtle' | 'fox';
type Movement = 'stretch' | 'wiggle' | 'breathe' | 'hug';

const creatures: { value: Creature; label: string; emoji: string }[] = [
  { value: 'firefly', label: 'Friendly Firefly', emoji: '🪲' },
  { value: 'turtle', label: 'Tiny Turtle', emoji: '🐢' },
  { value: 'fox', label: 'Calm Fox', emoji: '🦊' },
];

const movements: { value: Movement; label: string; instruction: string; emoji: string }[] = [
  { value: 'stretch', label: 'Slow Stretch', instruction: 'Reach your arms up high and stretch gently', emoji: '🙆' },
  { value: 'wiggle', label: 'Wiggle Shake', instruction: 'Wiggle your fingers and shake out your body', emoji: '🤸' },
  { value: 'breathe', label: 'Deep Breaths', instruction: 'Take 3 slow, deep breaths in and out', emoji: '🫁' },
  { value: 'hug', label: 'Self Hug', instruction: 'Give yourself a gentle, warm hug', emoji: '🤗' },
];

export default function CalmCreature() {
  const navigate = useNavigate();
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [currentMovement, setCurrentMovement] = useState(0);
  const [completedMovements, setCompletedMovements] = useState<number[]>([]);

  const isComplete = completedMovements.length === movements.length;
  const currentMove = movements[currentMovement];

  const handleCreatureSelect = (creature: Creature) => {
    setSelectedCreature(creature);
  };

  const handleMovementComplete = () => {
    if (!completedMovements.includes(currentMovement)) {
      setCompletedMovements([...completedMovements, currentMovement]);
    }
    if (currentMovement < movements.length - 1) {
      setCurrentMovement(currentMovement + 1);
    }
  };

  const handleReset = () => {
    setSelectedCreature(null);
    setCurrentMovement(0);
    setCompletedMovements([]);
  };

  const selectedCreatureData = creatures.find(c => c.value === selectedCreature);

  if (!selectedCreature) {
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
              Follow the Calm Creature 🐾
            </h1>
          </div>

          <p className="text-muted-foreground font-medium">
            Choose your calm creature friend
          </p>

          <div className="grid grid-cols-1 gap-4">
            {creatures.map((creature) => (
              <Card
                key={creature.value}
                className="p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-soft-lg"
                onClick={() => handleCreatureSelect(creature.value)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl shadow-soft">
                    {creature.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{creature.label}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <BottomNav role="child" />
      </div>
    );
  }

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
              Follow the Calm Creature 🐾
            </h1>
          </div>

          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
              <div className="text-6xl animate-bounce">{selectedCreatureData?.emoji}</div>
              <h2 className="text-2xl font-bold">
                Great Job! ✨
              </h2>
              <p className="text-muted-foreground font-medium">
                You followed {selectedCreatureData?.label} through all the calming movements!
              </p>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Try Another Creature
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
            Follow {selectedCreatureData?.label} 🐾
          </h1>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Movement {currentMovement + 1} of {movements.length}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-6">
          <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
            {selectedCreatureData?.emoji}
          </div>
          <div className="space-y-4">
            <div className="text-5xl">{currentMove.emoji}</div>
            <h2 className="text-2xl font-bold">{currentMove.label}</h2>
            <p className="text-lg text-muted-foreground font-medium">
              {currentMove.instruction}
            </p>
          </div>
        </Card>

        <Button 
          onClick={handleMovementComplete}
          className="w-full"
          size="lg"
        >
          <Check className="mr-2 h-5 w-5" />
          I Did It!
        </Button>

        <div className="flex gap-2 justify-center">
          {movements.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                completedMovements.includes(index) 
                  ? 'bg-interactive-accent' 
                  : index === currentMovement
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
