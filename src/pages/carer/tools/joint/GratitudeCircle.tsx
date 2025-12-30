import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, RotateCcw, CheckCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const prompts = [
  "Something that made me smile today...",
  "A person I'm thankful for...",
  "Something yummy I ate recently...",
  "A place that makes me feel happy...",
  "Something I'm proud of...",
  "A sound I love to hear...",
  "Something kind someone did for me...",
  "My favourite thing about today...",
];

export default function GratitudeCircle() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState<'child' | 'carer'>('child');
  const [promptIndex, setPromptIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const totalRounds = 3;

  const handleNextTurn = () => {
    if (currentTurn === 'child') {
      setCurrentTurn('carer');
    } else {
      if (currentRound >= totalRounds) {
        setCompleted(true);
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentTurn('child');
        setPromptIndex((promptIndex + 1) % prompts.length);
      }
    }
  };

  const handleRestart = () => {
    setCurrentRound(1);
    setCurrentTurn('child');
    setPromptIndex(0);
    setCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/joint-tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Gratitude Circle
            </h1>
            <p className="text-muted-foreground text-sm">Take turns sharing what you're grateful for</p>
          </div>
        </div>

        {!completed ? (
          <>
            <Card className="relative p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
              
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  Round {currentRound} of {totalRounds}
                </div>
                
                <div className="py-4">
                  <p className="text-lg font-semibold mb-2">
                    {currentTurn === 'child' ? "Your child's turn" : "Your turn"}
                  </p>
                  <div className="text-5xl mb-4">
                    {currentTurn === 'child' ? '🧒' : '👨‍👩‍👧'}
                  </div>
                </div>

                <Card className="p-4 bg-primary/10 border-primary/20">
                  <p className="text-lg font-medium">{prompts[promptIndex]}</p>
                </Card>

                <p className="text-sm text-muted-foreground">
                  Take your time to think and share out loud
                </p>
              </div>
            </Card>

            <Button 
              onClick={handleNextTurn} 
              className="w-full"
              size="lg"
            >
              {currentTurn === 'child' ? "Child has shared → Your turn" : "Done → Next round"}
            </Button>
          </>
        ) : (
          <Card className="relative p-8 bg-gradient-to-br from-primary/10 via-accent/15 to-secondary/10 border-interactive-accent/20 shadow-soft-lg text-center">
            <DecorativeIcon icon="sparkles" position="top-right" opacity={0.15} />
            
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 mx-auto text-interactive-accent" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Beautiful! 💜</h2>
                <p className="text-muted-foreground">
                  You've just shared {totalRounds * 2} things you're grateful for together. 
                  What a wonderful way to connect!
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRestart} className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
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
            💡 Tip: Really listen to each other's answers and ask follow-up questions like "Tell me more!"
          </p>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
