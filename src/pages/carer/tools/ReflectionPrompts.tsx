import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Save, AlertCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [carerId, setCarerId] = useState<string | null>(null);

  const currentPrompt = prompts[currentPromptIndex];

  // Get carer profile ID
  useEffect(() => {
    const getCarerProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('carer_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (profile) {
          setCarerId(profile.id);
        }
      }
    };
    getCarerProfile();
  }, []);

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
    
    try {
      const { data, error } = await supabase.functions.invoke('carer-reframe', {
        body: { reflection: response }
      });

      if (error) {
        console.error('Reframe error:', error);
        
        if (error.message?.includes('429')) {
          toast({
            title: 'Please wait',
            description: 'Too many requests. Please try again in a moment.',
            variant: 'destructive',
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: 'Service temporarily unavailable',
            description: 'Please try again later.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Could not generate reframe',
            description: 'Please try again or continue without a reframe.',
            variant: 'destructive',
          });
        }
        setIsReframing(false);
        return;
      }

      if (data?.reframe) {
        setReframedText(data.reframe);
      }
    } catch (error) {
      console.error('Reframe exception:', error);
      toast({
        title: 'Could not generate reframe',
        description: 'Please try again or continue without a reframe.',
        variant: 'destructive',
      });
    } finally {
      setIsReframing(false);
    }
  };

  const handleSave = async () => {
    if (!carerId) {
      toast({
        title: 'Error',
        description: 'Could not save reflection. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Save to carer_journal_entries
    const entryText = `Prompt: ${currentPrompt.question}\n\nResponse: ${response}${reframedText ? `\n\nReframe: ${reframedText}` : ''}`;
    
    const { error } = await supabase
      .from('carer_journal_entries')
      .insert({
        carer_id: carerId,
        entry_type: 'reflection',
        entry_text: entryText,
      });

    if (error) {
      console.error('Save error:', error);
      toast({
        title: 'Could not save',
        description: 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

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

        <Card className="relative p-6 space-y-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold title-accessible">{currentPrompt.question}</h2>
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
              className="flex-1 transition-all duration-200 hover:scale-[1.02] hover:bg-interactive-accent/10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isReframing ? 'Reframing...' : 'Gentle Reframe'}
            </Button>
            <Button onClick={handleSave} disabled={!response.trim()} className="flex-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-soft">
              <Save className="h-4 w-4 mr-2" />
              Save & Continue
            </Button>
          </div>

          {reframedText && (
            <Card className="relative p-4 bg-gradient-to-br from-primary/5 to-accent/10 border-interactive-accent/20 shadow-soft animate-fade-in">
              <DecorativeIcon icon="sparkles" position="top-left" opacity={0.1} />
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-interactive-accent" />
                A Kinder Perspective
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {reframedText}
              </p>
            </Card>
          )}
        </Card>

        <Card className="relative p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-interactive-accent/10 shadow-soft">
          <DecorativeIcon icon="sparkles" position="bottom-right" opacity={0.08} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Tip:</strong> Reflection helps you process emotions and notice patterns. 
            There's no right or wrong — just honesty and self-compassion.
          </p>
        </Card>

        <Alert className="bg-primary/5 border-primary/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            If you're feeling overwhelmed or worried about safety, it's important to speak with a GP, school, or local NHS support service.
          </AlertDescription>
        </Alert>

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
