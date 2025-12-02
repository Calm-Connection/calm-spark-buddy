import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { WendyTipCard } from '@/components/WendyTipCard';

const worryWords = [
  { id: 1, text: 'School', emoji: '📚' },
  { id: 2, text: 'Friends', emoji: '👫' },
  { id: 3, text: 'Homework', emoji: '✏️' },
  { id: 4, text: 'Changes', emoji: '🔄' },
  { id: 5, text: 'Loud Noises', emoji: '🔊' },
];

export default function BlowWorryClouds() {
  const navigate = useNavigate();
  const [clearedClouds, setClearedClouds] = useState<number[]>([]);
  const allCleared = clearedClouds.length === worryWords.length;

  const handleCloudClick = (id: number) => {
    if (!clearedClouds.includes(id)) {
      setClearedClouds([...clearedClouds, id]);
    }
  };

  const handleReset = () => {
    setClearedClouds([]);
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
            Blow Away Worry Clouds ☁️
          </h1>
        </div>

        {!allCleared ? (
          <>
            <p className="text-muted-foreground font-medium">
              Tap each worry cloud to blow it away gently
            </p>

            <div className="grid grid-cols-1 gap-4 min-h-[400px]">
              {worryWords.map((worry) => {
                const isCleared = clearedClouds.includes(worry.id);
                return (
                  <Card
                    key={worry.id}
                    className={`p-6 cursor-pointer transition-all duration-500 ${
                      isCleared 
                        ? 'opacity-0 scale-0 pointer-events-none' 
                        : 'hover:scale-[1.02] hover:shadow-soft-lg opacity-100 scale-100'
                    }`}
                    onClick={() => handleCloudClick(worry.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl shadow-soft">
                        {worry.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{worry.text}</h3>
                        <p className="text-sm text-muted-foreground">Tap to clear</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {clearedClouds.length} of {worryWords.length} cleared
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 text-center space-y-4">
              <div className="text-6xl animate-bounce">
                <Sparkles className="w-16 h-16 mx-auto text-interactive-accent" />
              </div>
              <h2 className="text-2xl font-bold">
                All Clear! 🌤️
              </h2>
              <p className="text-muted-foreground font-medium">
                You cleared all your worry clouds. Remember, worries don't last forever.
              </p>
            </Card>

            <WendyTipCard tip="When worries feel big, imagine them as clouds. They float by and eventually drift away. You're stronger than your worries! 💪" />

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
