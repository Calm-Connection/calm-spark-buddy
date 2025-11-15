import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Smile, Frown, Heart } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { toast } from 'sonner';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const reflectionPrompts = [
  { prompt: "What made you smile today?", emoji: "😊", type: "positive" },
  { prompt: "Something that felt tricky?", emoji: "🤔", type: "challenge" },
  { prompt: "What helped you feel calm?", emoji: "🌈", type: "coping" },
  { prompt: "Something you're proud of?", emoji: "⭐", type: "proud" },
  { prompt: "A kind thing someone did?", emoji: "💝", type: "gratitude" },
  { prompt: "How are you feeling right now?", emoji: "💭", type: "current" },
];

const emojiResponses = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😟", label: "Worried" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤗", label: "Loved" },
  { emoji: "😤", label: "Frustrated" },
];

export default function GentleReflections() {
  const navigate = useNavigate();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<Array<{ prompt: string; response: string }>>([]);
  const [textResponse, setTextResponse] = useState("");
  const [complete, setComplete] = useState(false);

  const currentPrompt = reflectionPrompts[currentPromptIndex];

  const handleEmojiResponse = (emoji: string) => {
    saveResponse(emoji);
  };

  const handleTextResponse = () => {
    if (textResponse.trim()) {
      saveResponse(textResponse);
      setTextResponse("");
    }
  };

  const saveResponse = (response: string) => {
    setResponses([...responses, { prompt: currentPrompt.prompt, response }]);
    
    if (currentPromptIndex < reflectionPrompts.length - 1) {
      setTimeout(() => {
        setCurrentPromptIndex(currentPromptIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setComplete(true);
        toast.success("Reflection complete! 🌟");
      }, 500);
    }
  };

  const skipPrompt = () => {
    if (currentPromptIndex < reflectionPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      setComplete(true);
    }
  };

  const reset = () => {
    setCurrentPromptIndex(0);
    setResponses([]);
    setTextResponse("");
    setComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gentle Reflections ✨</h1>
        </div>

        {!complete ? (
          <>
            {/* Progress */}
            <div className="flex justify-center gap-2">
              {reflectionPrompts.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx < currentPromptIndex
                      ? 'w-8 bg-secondary'
                      : idx === currentPromptIndex
                      ? 'w-12 bg-primary'
                      : 'w-6 bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Current Prompt */}
            <Card className="relative p-8 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft text-center">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/30 to-warm/30 flex items-center justify-center animate-gentle-pulse"
              >
                <span className="text-5xl">{currentPrompt.emoji}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{currentPrompt.prompt}</h2>
              <p className="text-sm text-muted-foreground">
                Take a moment to think... there's no rush 🌸
              </p>
            </Card>

            {/* Quick Emoji Response */}
            <Card className="p-6 bg-card">
              <p className="font-bold mb-3 text-center">Quick Answer with Emoji:</p>
              <div className="grid grid-cols-4 gap-3">
                {emojiResponses.map((emoji) => (
                  <button
                    key={emoji.emoji}
                    onClick={() => handleEmojiResponse(emoji.emoji)}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-accent/20 transition-colors"
                  >
                    <span className="text-3xl mb-1">{emoji.emoji}</span>
                    <span className="text-xs text-muted-foreground">{emoji.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Text Response Option */}
            <Card className="p-6 bg-card">
              <p className="font-bold mb-3">Or share your thoughts:</p>
              <textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder="Type here if you'd like to say more..."
                className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 mt-3">
                <Button onClick={handleTextResponse} disabled={!textResponse.trim()} className="flex-1">
                  Save Thought 💭
                </Button>
                <Button onClick={skipPrompt} variant="ghost">
                  Skip
                </Button>
              </div>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
              Every feeling is okay — thank you for sharing 💙
            </p>
          </>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-secondary/30 to-accent/30 text-center border-2 border-secondary">
              <Heart className="w-20 h-20 mx-auto mb-4 text-primary animate-gentle-pulse" />
              <h2 className="text-2xl font-bold mb-3">Thank You for Reflecting 🌟</h2>
              <p className="text-lg mb-2">
                Taking time to notice your feelings is really important.
              </p>
              <p className="text-muted-foreground">
                You're learning about yourself — and that's something special! ✨
              </p>
            </Card>

            {/* Summary of responses */}
            {responses.length > 0 && (
              <Card className="p-6 bg-card">
                <h3 className="font-bold mb-3">Your Reflections Today:</h3>
                <div className="space-y-3">
                  {responses.map((r, idx) => (
                    <div key={idx} className="p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm font-bold mb-1">{r.prompt}</p>
                      <p className="text-lg">{r.response}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={reset} variant="outline">
                Reflect Again ↻
              </Button>
              <Button onClick={() => navigate('/child/journal')}>
                Write in Journal 📝
              </Button>
            </div>

            <Card className="p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground text-center">
                💡 Regular reflection helps you understand your emotions better. You're doing great!
              </p>
            </Card>
          </div>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
