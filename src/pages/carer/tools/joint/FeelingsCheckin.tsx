import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const emotionCards = [
  { emoji: '😊', label: 'Happy', color: 'from-yellow-400/20 to-orange-400/20' },
  { emoji: '😢', label: 'Sad', color: 'from-blue-400/20 to-indigo-400/20' },
  { emoji: '😠', label: 'Angry', color: 'from-red-400/20 to-orange-400/20' },
  { emoji: '😰', label: 'Worried', color: 'from-purple-400/20 to-pink-400/20' },
  { emoji: '😌', label: 'Calm', color: 'from-green-400/20 to-teal-400/20' },
  { emoji: '🤩', label: 'Excited', color: 'from-pink-400/20 to-yellow-400/20' },
  { emoji: '😴', label: 'Tired', color: 'from-gray-400/20 to-blue-400/20' },
  { emoji: '🤔', label: 'Confused', color: 'from-amber-400/20 to-yellow-400/20' },
];

const followUpQuestions = [
  "What made you feel this way?",
  "Where do you feel this in your body?",
  "What would help you feel better?",
  "Has something happened recently?",
  "Would you like to talk more about it?",
];

export default function FeelingsCheckin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'child' | 'carer' | 'discuss' | 'complete'>('child');
  const [childEmotion, setChildEmotion] = useState<string | null>(null);
  const [carerEmotion, setCarerEmotion] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleEmotionSelect = (emoji: string) => {
    if (step === 'child') {
      setChildEmotion(emoji);
      setStep('carer');
    } else if (step === 'carer') {
      setCarerEmotion(emoji);
      setStep('discuss');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < followUpQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('complete');
    }
  };

  const handleRestart = () => {
    setStep('child');
    setChildEmotion(null);
    setCarerEmotion(null);
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background pb-24">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/joint-tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-accent-foreground" />
              Feelings Check-in
            </h1>
            <p className="text-muted-foreground text-sm">Use emotion cards to talk about feelings</p>
          </div>
        </div>

        {(step === 'child' || step === 'carer') && (
          <Card className="relative p-6 bg-gradient-to-br from-accent/5 via-primary/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
            <DecorativeIcon icon="flower" position="top-right" opacity={0.1} />
            
            <div className="text-center space-y-4">
              <div className="text-5xl mb-2">
                {step === 'child' ? '🧒' : '👨‍👩‍👧'}
              </div>
              <p className="text-lg font-semibold">
                {step === 'child' ? "How is your child feeling right now?" : "How are you feeling right now?"}
              </p>
              <p className="text-sm text-muted-foreground">
                Pick the emotion card that feels closest
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-6">
              {emotionCards.map((emotion) => (
                <button
                  key={emotion.label}
                  onClick={() => handleEmotionSelect(emotion.emoji)}
                  className={`p-3 rounded-xl bg-gradient-to-br ${emotion.color} hover:scale-105 transition-transform flex flex-col items-center gap-1`}
                >
                  <span className="text-3xl">{emotion.emoji}</span>
                  <span className="text-xs font-medium">{emotion.label}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 'discuss' && (
          <>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/10">
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Child</p>
                  <span className="text-5xl">{childEmotion}</span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">You</p>
                  <span className="text-5xl">{carerEmotion}</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Great! Now let's talk about your feelings together
              </p>
            </Card>

            <Card className="relative p-6 bg-gradient-to-br from-secondary/10 to-primary/5 border-interactive-accent/20 shadow-soft-lg">
              <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
              
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Discussion prompt</p>
                <p className="text-xl font-semibold">{followUpQuestions[currentQuestion]}</p>
                <p className="text-sm text-muted-foreground">
                  Take turns answering this question together
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleNextQuestion} className="flex-1">
                {currentQuestion < followUpQuestions.length - 1 ? "Next Question" : "Finish"}
              </Button>
            </div>
          </>
        )}

        {step === 'complete' && (
          <Card className="relative p-8 bg-gradient-to-br from-primary/10 via-accent/15 to-secondary/10 border-interactive-accent/20 shadow-soft-lg text-center">
            <DecorativeIcon icon="sparkles" position="top-right" opacity={0.15} />
            
            <div className="space-y-6">
              <CheckCircle className="h-16 w-16 mx-auto text-interactive-accent" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Well Done! 💜</h2>
                <p className="text-muted-foreground">
                  You've had a meaningful feelings check-in together. 
                  Understanding each other's emotions helps build a stronger connection.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRestart} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check-in Again
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
            💡 Tip: There are no wrong answers. All feelings are valid and worth talking about.
          </p>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
