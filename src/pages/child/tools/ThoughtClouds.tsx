import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Cloud, Sun, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { toast } from 'sonner';
import { DecorativeIcon } from '@/components/DecorativeIcon';

interface ThoughtCloud {
  id: number;
  feeling: string;
  emoji: string;
  position: { x: number; y: number };
  cleared: boolean;
}

const initialClouds: ThoughtCloud[] = [
  { id: 1, feeling: "worried", emoji: "😟", position: { x: 20, y: 30 }, cleared: false },
  { id: 2, feeling: "angry", emoji: "😠", position: { x: 60, y: 50 }, cleared: false },
  { id: 3, feeling: "sad", emoji: "😢", position: { x: 40, y: 70 }, cleared: false },
  { id: 4, feeling: "scared", emoji: "😰", position: { x: 75, y: 35 }, cleared: false },
];

const reframeQuestions = {
  worried: [
    "What's making you feel worried right now?",
    "Has this worry happened before? What happened then?",
    "What's one small thing that might help?"
  ],
  angry: [
    "What made you feel angry?",
    "Is there another way to think about this?",
    "What could help you feel calmer?"
  ],
  sad: [
    "What's making you feel sad?",
    "Can you think of something that usually makes you smile?",
    "Who could you talk to about this?"
  ],
  scared: [
    "What's making you feel scared?",
    "Are you safe right now?",
    "What helps you feel brave?"
  ]
};

export default function ThoughtClouds() {
  const navigate = useNavigate();
  const [clouds, setClouds] = useState<ThoughtCloud[]>(initialClouds);
  const [selectedCloud, setSelectedCloud] = useState<ThoughtCloud | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reflections, setReflections] = useState<string[]>([]);

  const handleCloudClick = (cloud: ThoughtCloud) => {
    if (cloud.cleared) return;
    setSelectedCloud(cloud);
    setCurrentQuestion(0);
  };

  const handleNextQuestion = () => {
    if (!selectedCloud) return;
    
    const questions = reframeQuestions[selectedCloud.feeling as keyof typeof reframeQuestions];
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Clear the cloud
      setClouds(clouds.map(c => 
        c.id === selectedCloud.id ? { ...c, cleared: true } : c
      ));
      
      toast.success("Cloud cleared! 🌤️ You're learning to work through tough feelings.");
      setSelectedCloud(null);
      setCurrentQuestion(0);
    }
  };

  const clearedCount = clouds.filter(c => c.cleared).length;
  const allCleared = clearedCount === clouds.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Thought Clouds 💭</h1>
        </div>

        {!allCleared ? (
          <>
            <Card className="relative p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
              <DecorativeIcon icon="cloud" position="top-right" opacity={0.12} />
              <p className="text-center">
                Tap a thought cloud to work through that feeling. 
                Answer the questions to clear the clouds! ☁️→☀️
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Cleared: {clearedCount} / {clouds.length}
              </p>
            </Card>

            {/* Sky with clouds */}
            <div className="relative min-h-[400px] bg-gradient-to-b from-primary/20 to-secondary/20 rounded-lg p-4 overflow-hidden">
              {clouds.map((cloud) => (
                <button
                  key={cloud.id}
                  onClick={() => handleCloudClick(cloud)}
                  disabled={cloud.cleared}
                  className={`absolute transition-all duration-1000 ${
                    cloud.cleared
                      ? 'opacity-0 scale-0'
                      : 'opacity-100 scale-100 hover:scale-110'
                  }`}
                  style={{
                    left: `${cloud.position.x}%`,
                    top: `${cloud.position.y}%`,
                    animation: cloud.cleared ? 'none' : `float-slow ${5 + cloud.id}s ease-in-out infinite`
                  }}
                >
                  <div className="relative">
                    <Cloud className="w-20 h-20 text-muted fill-muted/30" />
                    <span className="absolute inset-0 flex items-center justify-center text-3xl">
                      {cloud.emoji}
                    </span>
                  </div>
                </button>
              ))}

              {/* Sun appears when all cleared */}
              {allCleared && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Sun className="w-32 h-32 text-warm animate-gentle-pulse" />
                </div>
              )}
            </div>

            {/* Question Dialog */}
            {selectedCloud && (
              <Card className="p-6 bg-gradient-to-br from-secondary/30 to-accent/30 border-2 border-secondary animate-scale-in">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{selectedCloud.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Feeling {selectedCloud.feeling}?</h3>
                    <p className="text-lg mb-4">
                      {reframeQuestions[selectedCloud.feeling as keyof typeof reframeQuestions][currentQuestion]}
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={handleNextQuestion} className="flex-1">
                        {currentQuestion < reframeQuestions[selectedCloud.feeling as keyof typeof reframeQuestions].length - 1
                          ? "Next Question →"
                          : "Clear Cloud ☀️"}
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedCloud(null)}>
                        Later
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-warm/30 to-accent/30 text-center border-2 border-secondary">
              <Sparkles className="w-20 h-20 mx-auto mb-4 text-primary animate-gentle-pulse" />
              <h2 className="text-2xl font-bold mb-3">Clear Skies Ahead! ☀️</h2>
              <p className="text-lg mb-2">
                You worked through all those big feelings — that takes courage!
              </p>
              <p className="text-muted-foreground">
                Every feeling is okay. What matters is that you're learning to understand them. 💙
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => {
                setClouds(initialClouds);
                setReflections([]);
              }} variant="outline">
                Try Again ↻
              </Button>
              <Button onClick={() => navigate('/child/journal')}>
                Write in Journal 📝
              </Button>
            </div>
          </div>
        )}

        <Card className="p-4 bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            💡 Working through feelings helps them feel less scary. You're doing great!
          </p>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
