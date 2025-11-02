import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Save } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';

const prompts = [
  {
    question: 'What helped your child feel safe today?',
    placeholder: 'Maybe it was a hug, a listening ear, or just being present...',
  },
  {
    question: 'When did you feel most connected?',
    placeholder: 'Think about a small moment of closeness or understanding...',
  },
  {
    question: 'What did your body need today?',
    placeholder: 'Rest, movement, nourishment, space...?',
  },
  {
    question: 'What story are you telling yourself about today — is it kind?',
    placeholder: "Notice if you're being critical. What would a compassionate friend say?",
  },
  {
    question: 'What small win can you celebrate today?',
    placeholder: 'Even the tiniest thing counts...',
  },
];

export default function ReflectionPrompts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [reframedText, setReframedText] = useState('');
  const [isReframing, setIsReframing] = useState(false);

  const currentPrompt = prompts[currentPromptIndex];

  const handleReframe = async () => {
    if (!response.trim()) {
      toast({
        title: 'Write something first',
        description: 'Share your thoughts before asking for a reframe',
        variant: 'destructive',
      });
      return;
    }

    setIsReframing(true);
    
    // Simulate AI reframing - in production, this would call an edge function
    setTimeout(() => {
      const reframes = [
        `What if this wasn't a failure, but a learning moment? ${response.slice(0, 50)}... shows you're trying, and that's what matters.`,
        `You're being so hard on yourself. Look at what you did manage: ${response.slice(0, 50)}... That took strength.`,
        `Notice the self-criticism here. A kinder story might be: You showed up today, even when it was hard. That's parenting with courage.`,
      ];
      setReframedText(reframes[Math.floor(Math.random() * reframes.length)]);
      setIsReframing(false);
    }, 2000);
  };

  const handleSave = () => {
    // In production, save to carer_journal_entries
    toast({
      title: 'Reflection saved',
      description: 'Your thoughts have been recorded',
    });
    
    // Move to next prompt or finish
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setResponse('');
      setReframedText('');
    } else {
      navigate('/carer/journal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 to-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/resources')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Reflection Prompts 💬</h1>
            <p className="text-muted-foreground">Journaling for emotional clarity</p>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{currentPrompt.question}</h2>
              <span className="text-xs text-muted-foreground">
                {currentPromptIndex + 1} / {prompts.length}
              </span>
            </div>
          </div>

          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={currentPrompt.placeholder}
            className="min-h-[180px] resize-none"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReframe}
              disabled={isReframing || !response.trim()}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isReframing ? 'Reframing...' : 'Gentle Reframe'}
            </Button>
            <Button onClick={handleSave} disabled={!response.trim()} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save & Continue
            </Button>
          </div>

          {reframedText && (
            <Card className="p-4 bg-accent/20 border-accent animate-fade-in">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                A Kinder Perspective
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {reframedText}
              </p>
            </Card>
          )}
        </Card>

        <Card className="p-5 bg-gradient-to-br from-warm/20 to-accent/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> Reflection helps you process emotions and notice patterns. 
            There's no right or wrong — just honesty and self-compassion.
          </p>
        </Card>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentPromptIndex > 0) {
                setCurrentPromptIndex(currentPromptIndex - 1);
                setResponse('');
                setReframedText('');
              }
            }}
            disabled={currentPromptIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentPromptIndex < prompts.length - 1) {
                setCurrentPromptIndex(currentPromptIndex + 1);
                setResponse('');
                setReframedText('');
              }
            }}
            disabled={currentPromptIndex === prompts.length - 1}
          >
            Skip
          </Button>
        </div>
      </div>
      <BottomNav role="carer" />
    </div>
  );
}
