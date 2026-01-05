import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const calmColors = [
  { name: 'Ocean Blue', hsl: 'hsl(200, 70%, 75%)', emoji: '🌊' },
  { name: 'Forest Green', hsl: 'hsl(140, 50%, 70%)', emoji: '🌲' },
  { name: 'Sunset Purple', hsl: 'hsl(280, 60%, 75%)', emoji: '🌅' },
  { name: 'Warm Pink', hsl: 'hsl(340, 70%, 80%)', emoji: '🌸' },
  { name: 'Sunshine Yellow', hsl: 'hsl(50, 90%, 75%)', emoji: '☀️' },
  { name: 'Soft Peach', hsl: 'hsl(30, 80%, 80%)', emoji: '🍑' },
];

type VisualizationStep = 'intro' | 'choose' | 'visualize' | 'complete';

export default function ColourCalm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<VisualizationStep>('intro');
  const [selectedColor, setSelectedColor] = useState(calmColors[0]);
  const [visualizing, setVisualizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (step === 'complete' && !hasTracked && user) {
      setHasTracked(true);
      supabase.from('tool_usage').insert({
        user_id: user.id,
        tool_name: 'Colour Calm',
        duration_minutes: 2,
        completed: true
      }).then(() => {});
    }
  }, [step, hasTracked, user]);

  useEffect(() => {
    if (visualizing && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 2, 100));
      }, 200);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setTimeout(() => {
        setVisualizing(false);
        setStep('complete');
      }, 1000);
    }
  }, [visualizing, progress]);

  const startVisualization = () => {
    setStep('visualize');
    setVisualizing(true);
    setProgress(0);
  };

  const resetExercise = () => {
    setStep('intro');
    setVisualizing(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Colour Calm 🌈</h1>
        </div>

        {step === 'intro' && (
          <div className="space-y-6">
            <Card className="relative p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
              <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-interactive-accent bg-clip-text text-transparent">Imagine Your Calm Color</h2>
              <p className="text-muted-foreground mb-4">
                This gentle exercise uses the power of your imagination to help you feel calm and safe.
              </p>
              <p className="mb-2">You'll:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Pick a color that feels calm to you</li>
                <li>Close your eyes and imagine that color</li>
                <li>Feel it spreading warmth through your body</li>
              </ul>
            </Card>

            <Button onClick={() => setStep('choose')} className="w-full text-lg py-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-soft" size="lg">
              Let's Begin ✨
            </Button>
          </div>
        )}

        {step === 'choose' && (
          <div className="space-y-6">
            <Card className="relative p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
              <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-interactive-accent bg-clip-text text-transparent">Pick Your Calm Color</h2>
              <p className="text-muted-foreground">Which color makes you feel peaceful?</p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {calmColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`p-6 rounded-lg border-4 transition-all ${
                    selectedColor.name === color.name
                      ? 'border-primary scale-105'
                      : 'border-transparent hover:border-muted'
                  }`}
                  style={{ backgroundColor: color.hsl }}
                >
                  <span className="text-4xl block mb-2">{color.emoji}</span>
                  <p className="font-bold text-foreground">{color.name}</p>
                </button>
              ))}
            </div>

            <Button onClick={startVisualization} className="w-full text-lg py-6" size="lg">
              Start Visualization with {selectedColor.emoji}
            </Button>
          </div>
        )}

        {step === 'visualize' && (
          <div className="space-y-6">
            <Card 
              className="p-8 min-h-[400px] flex flex-col items-center justify-center transition-all duration-500"
              style={{ 
                background: `radial-gradient(circle, ${selectedColor.hsl} ${progress}%, hsl(var(--background)) 100%)`,
              }}
            >
              <div className="text-center space-y-6">
                <Heart 
                  className="w-20 h-20 mx-auto text-foreground/80 animate-gentle-pulse"
                  style={{ animationDuration: '2s' }}
                />
                
                <div className="space-y-3">
                  {progress < 30 && (
                    <p className="text-lg font-bold animate-fade-in">
                      Close your eyes... 👁️
                    </p>
                  )}
                  {progress >= 30 && progress < 60 && (
                    <p className="text-lg font-bold animate-fade-in">
                      Imagine your {selectedColor.name} spreading from your heart... {selectedColor.emoji}
                    </p>
                  )}
                  {progress >= 60 && progress < 90 && (
                    <p className="text-lg font-bold animate-fade-in">
                      Feel it flowing to your hands and toes... ✨
                    </p>
                  )}
                  {progress >= 90 && (
                    <p className="text-lg font-bold animate-fade-in">
                      That color helps you feel calm and strong 💪
                    </p>
                  )}
                </div>

                <div className="w-full bg-background/20 rounded-full h-2">
                  <div 
                    className="bg-foreground/60 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>

            <p className="text-center text-muted-foreground text-sm">
              Take slow, gentle breaths... 🌬️
            </p>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-secondary/30 to-accent/30 text-center border-2 border-secondary">
              <Sparkles className="w-20 h-20 mx-auto mb-4 text-primary animate-gentle-pulse" />
              <h2 className="text-2xl font-bold mb-3">Beautiful Work! 🌟</h2>
              <p className="text-lg mb-2">
                You used the power of your imagination to create calm.
              </p>
              <p className="text-muted-foreground">
                Whenever you need to feel calm, you can imagine your special color spreading through your body. 💙
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={resetExercise} variant="outline">
                Try Again ↻
              </Button>
              <Button onClick={() => navigate('/child/tools')}>
                Back to Tools
              </Button>
            </div>

            <Card className="p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground text-center">
                💡 Your mind is powerful! Visualizing calm colors can help your body relax.
              </p>
            </Card>
            
            <div className="mt-4">
              <DisclaimerCard variant="tool-limitation" size="small" />
            </div>
          </div>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
