import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Smile, Sparkles, CheckCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const memoryPrompts = [
  "A time we laughed together...",
  "Our favourite family outing...",
  "A special meal we shared...",
  "When we helped each other...",
  "A holiday memory...",
  "Something silly we did...",
  "When we were proud of each other...",
  "A cosy moment at home...",
];

export default function HappyMemoryJar() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'prompt' | 'write' | 'share' | 'complete'>('prompt');
  const [currentPrompt, setCurrentPrompt] = useState(() => 
    memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)]
  );
  const [memory, setMemory] = useState('');

  const handleNewPrompt = () => {
    const newPrompt = memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)];
    setCurrentPrompt(newPrompt);
  };

  const handleStartWriting = () => {
    setStep('write');
  };

  const handleFinishWriting = () => {
    if (memory.trim()) {
      setStep('share');
    }
  };

  const handleComplete = () => {
    setStep('complete');
  };

  const handleNewMemory = () => {
    setStep('prompt');
    setMemory('');
    handleNewPrompt();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 to-background pb-24">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/joint-tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Smile className="h-6 w-6 text-secondary" />
              Happy Memory Jar
            </h1>
            <p className="text-muted-foreground text-sm">Capture and share happy memories together</p>
          </div>
        </div>

        {step === 'prompt' && (
          <>
            <Card className="relative p-6 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
              
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🫙✨</div>
                <p className="text-sm text-muted-foreground">Your memory prompt is...</p>
                <p className="text-xl font-semibold">{currentPrompt}</p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleNewPrompt} className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                New Prompt
              </Button>
              <Button onClick={handleStartWriting} className="flex-1">
                Write This Memory
              </Button>
            </div>
          </>
        )}

        {step === 'write' && (
          <>
            <Card className="p-4 bg-primary/10 border-primary/20">
              <p className="text-center font-medium">{currentPrompt}</p>
            </Card>

            <Card className="relative p-6 bg-gradient-to-br from-secondary/5 to-background border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="star" position="top-right" opacity={0.08} />
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Talk about this memory together, then write it down
                </p>
                <Textarea
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  placeholder="Write your happy memory here..."
                  className="min-h-[150px] text-base"
                />
                <p className="text-xs text-muted-foreground text-center">
                  You can write together or take turns adding to the memory
                </p>
              </div>
            </Card>

            <Button 
              onClick={handleFinishWriting} 
              className="w-full"
              disabled={!memory.trim()}
            >
              Save Memory
            </Button>
          </>
        )}

        {step === 'share' && (
          <>
            <Card className="relative p-6 bg-gradient-to-br from-secondary/10 via-primary/10 to-accent/10 border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
              
              <div className="text-center space-y-4">
                <div className="text-5xl">📝💜</div>
                <p className="text-sm text-muted-foreground">Your memory</p>
                <Card className="p-4 bg-background/50">
                  <p className="text-base whitespace-pre-wrap">{memory}</p>
                </Card>
                <p className="text-sm text-muted-foreground">
                  Read it out loud together and share how it makes you feel
                </p>
              </div>
            </Card>

            <Button onClick={handleComplete} className="w-full">
              We've Shared! ✨
            </Button>
          </>
        )}

        {step === 'complete' && (
          <Card className="relative p-8 bg-gradient-to-br from-primary/10 via-accent/15 to-secondary/10 border-interactive-accent/20 shadow-soft-lg text-center">
            <DecorativeIcon icon="sparkles" position="top-right" opacity={0.15} />
            
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 mx-auto text-interactive-accent" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Memory Saved! 🫙</h2>
                <p className="text-muted-foreground">
                  What a lovely memory to treasure together. Happy memories are like little treasures 
                  that warm our hearts when we need them most.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleNewMemory} className="flex-1">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add Another
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
            💡 Tip: You could keep a real memory jar at home and add notes to it regularly!
          </p>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
