import { useState, useEffect } from 'react';
import { ArrowLeft, Hand, Heart, Coffee, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { BottomNav } from '@/components/BottomNav';
import { Progress } from '@/components/ui/progress';

interface Exercise {
  id: string;
  title: string;
  icon: any;
  emoji: string;
  description: string;
  duration: number;
  steps: string[];
}

const exercises: Exercise[] = [
  {
    id: '54321',
    title: '5-4-3-2-1 Together',
    icon: Hand,
    emoji: '🖐️',
    description: 'Sensory grounding adapted for two. Take turns noticing the world around you.',
    duration: 5,
    steps: [
      "Look around together. Take turns naming 5 things you can see.",
      "Now notice 4 things you can touch. Feel them together.",
      "Listen quietly. What are 3 sounds you can hear?",
      "Sniff the air. Can you notice 2 things you can smell?",
      "Finally, what's 1 thing you can taste right now?"
    ]
  },
  {
    id: 'warm-hands',
    title: 'Warm Hands',
    icon: Heart,
    emoji: '🤲',
    description: 'A simple hand-warming technique that creates connection and calm.',
    duration: 4,
    steps: [
      "Rub your hands together quickly for 10 seconds.",
      "Now cup your warm hands over your eyes.",
      "Feel the warmth. Take 3 slow breaths together.",
      "Open your eyes slowly. Notice how you feel."
    ]
  },
  {
    id: 'slow-sipping',
    title: 'Slow Sipping',
    icon: Coffee,
    emoji: '☕',
    description: 'Mindful drinking together. Perfect with warm milk, tea, or water.',
    duration: 3,
    steps: [
      "Get a warm drink each (or share one).",
      "Hold the cup in both hands. Feel the warmth.",
      "Take one small sip. Notice the temperature and taste.",
      "Put the cup down. Wait 5 seconds before the next sip.",
      "Repeat slowly. No need to talk—just sip and breathe."
    ]
  },
  {
    id: 'body-scan',
    title: 'Body Scan for Two',
    icon: Sparkles,
    emoji: '🧘',
    description: 'Simplified body awareness practice. Gentle and calming.',
    duration: 4,
    steps: [
      "Sit or lie down comfortably, side by side.",
      "Close your eyes or look down. Notice your feet. Wiggle your toes.",
      "Now notice your belly. Feel it move as you breathe.",
      "Notice your shoulders. Roll them back gently.",
      "Finally, notice your face. Let it soften and relax."
    ]
  }
];

export default function GroundingTogether() {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive || !selectedExercise) return;

    const stepDuration = (selectedExercise.duration * 60 * 1000) / selectedExercise.steps.length;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (stepDuration / 100));
        if (newProgress >= 100) {
          if (currentStep < selectedExercise.steps.length - 1) {
            setCurrentStep((s) => s + 1);
            return 0;
          } else {
            setIsActive(false);
            setIsComplete(true);
            clearInterval(interval);
            return 100;
          }
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentStep, selectedExercise]);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setProgress(0);
    setIsComplete(false);
    setIsActive(true);
  };

  const resetExercise = () => {
    setSelectedExercise(null);
    setCurrentStep(0);
    setProgress(0);
    setIsComplete(false);
    setIsActive(false);
  };

  const goToNextStep = () => {
    if (selectedExercise && currentStep < selectedExercise.steps.length - 1) {
      setCurrentStep((s) => s + 1);
      setProgress(0);
    } else {
      setIsComplete(true);
      setIsActive(false);
    }
  };

  if (selectedExercise && !isComplete) {
    const Icon = selectedExercise.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={resetExercise}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{selectedExercise.emoji}</span>
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{selectedExercise.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="mb-4">
                  <span className="text-6xl">{selectedExercise.emoji}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Step {currentStep + 1} of {selectedExercise.steps.length}
                </h3>
                <p className="text-xl leading-relaxed mb-6">
                  {selectedExercise.steps[currentStep]}
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  {isActive ? 'Take your time...' : 'Ready for next step'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={goToNextStep}
                  className="flex-1"
                  variant={isActive ? "outline" : "default"}
                >
                  {currentStep < selectedExercise.steps.length - 1 ? 'Next Step' : 'Finish'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav role="carer" />
      </div>
    );
  }

  if (isComplete && selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="mb-6">
                <span className="text-7xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Beautiful Work</h2>
              <p className="text-lg text-foreground/80 mb-8">
                You just co-regulated together. That's powerful. Notice how you both feel right now.
              </p>
              <div className="flex gap-3">
                <Button onClick={resetExercise} className="flex-1">
                  Back to Exercises
                </Button>
                <Button onClick={() => startExercise(selectedExercise)} variant="outline" className="flex-1">
                  Do It Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav role="carer" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
      <DecorativeIcon icon="star" position="bottom-left" opacity={0.08} />

      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/carer/resources')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>

        <Card className="mb-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Grounding for Two</CardTitle>
            <CardDescription>
              Mini co-regulation exercises to do together when emotions feel big. These practices help
              you both return to calm through shared presence and simple sensory awareness.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-8 bg-accent/20 backdrop-blur-sm border-accent">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong>Co-regulation reminder:</strong> You don't need to be perfectly calm yourself. Just
              being present and offering structure helps. Your child's nervous system borrows safety from yours.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <Card
                key={exercise.id}
                className="bg-card/80 backdrop-blur-sm cursor-pointer hover:bg-card transition-colors"
                onClick={() => startExercise(exercise)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{exercise.emoji}</span>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
                      <p className="text-sm text-foreground/80 mb-3">{exercise.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⏱️ {exercise.duration} min</span>
                        <span>• {exercise.steps.length} steps</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
