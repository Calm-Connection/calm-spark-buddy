import { useState } from 'react';
import { ArrowLeft, Eye, Volume2, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { BottomNav } from '@/components/BottomNav';
import { Progress } from '@/components/ui/progress';

const safetySignals = [
  {
    id: 'soft-eyes',
    title: 'Soft Eyes',
    icon: Eye,
    emoji: '👁️',
    whatItIs: 'A relaxed, gentle gaze with soft eyebrows and a slightly unfocused look - not staring, not avoiding, just present.',
    whyItWorks: 'Direct, intense eye contact can trigger a threat response in anxious children. Soft eyes signal "I am here, but I am not a threat." It activates their social engagement system.',
    howToPractice: [
      'Look in a mirror. Notice your default eye tension.',
      'Soften your eyebrows. Let them drop slightly.',
      'Imagine looking at a sunset - relaxed, taking it in, not analyzing.',
      'Practice with your child during calm moments, not during conflict.'
    ],
    tryItPrompt: 'Soften your gaze right now. Relax your brows. Notice how your face feels different.',
    durationSeconds: 30
  },
  {
    id: 'warm-voice',
    title: 'Warm Voice',
    icon: Volume2,
    emoji: '🗣️',
    whatItIs: 'A lower pitch, slower pace, and melodic tone - like you are speaking to a friend who is unwell, not giving orders.',
    whyItWorks: 'High-pitched, fast, or sharp voices signal urgency and danger. A warm voice activates the ventral vagal (calm) pathway and helps regulate their nervous system through yours.',
    howToPractice: [
      'Record yourself speaking normally, then speaking "warmly."',
      'Lower your pitch slightly. Slow down by 20%.',
      'Add a gentle lilt - think lullaby, not lecture.',
      'Use this voice during transitions and tough moments, not just when praising.'
    ],
    tryItPrompt: 'Say this out loud warmly: "I am here. You are safe. We will figure this out together."',
    durationSeconds: 45
  },
  {
    id: 'slower-movements',
    title: 'Slower Movements',
    icon: Clock,
    emoji: '🐢',
    whatItIs: 'Deliberate, unhurried actions - no sudden gestures, no rushing around. Moving as if underwater.',
    whyItWorks: 'Quick, jerky movements signal chaos and danger. Slow, predictable movements create a felt sense of safety and help an anxious child settle.',
    howToPractice: [
      'Notice your default speed when stressed. Now halve it.',
      'When approaching your child during a meltdown, move slowly and predictably.',
      'Narrate your movements: "I am going to sit down next to you now."',
      'Practice during daily routines - slow breakfast prep, slow bedtime.'
    ],
    tryItPrompt: 'Stand up slowly. Sit down slowly. Notice how it feels to move with intention.',
    durationSeconds: 40
  },
  {
    id: 'gentle-proximity',
    title: 'Gentle Proximity',
    icon: Users,
    emoji: '🤗',
    whatItIs: 'Being near without crowding. Offering closeness while respecting their space. Letting them come to you.',
    whyItWorks: 'Anxious children often need connection but feel overwhelmed by touch or closeness. Gentle proximity says "I am available" without demanding engagement.',
    howToPractice: [
      'Sit nearby, not on top of them. About an arm\'s length away.',
      'Stay present but do not demand eye contact or conversation.',
      'Offer an open hand, let them choose to hold it.',
      'During meltdowns, sit on the floor at their level, just being with them.'
    ],
    tryItPrompt: 'Think of a time your child was upset. How close were you? Could you have offered presence without pressure?',
    durationSeconds: 35
  }
];

export default function SafetySignals() {
  const navigate = useNavigate();
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [practiceProgress, setPracticeProgress] = useState(0);

  const startPractice = (signalId: string, duration: number) => {
    setActiveSignal(signalId);
    setPracticeProgress(0);
    
    const interval = setInterval(() => {
      setPracticeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / duration);
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
      <DecorativeIcon icon="leaf" position="bottom-left" opacity={0.08} />

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
            <CardTitle className="text-3xl">Safety Signals</CardTitle>
            <CardDescription>
              Learn Polyvagal-aligned physical cues that communicate safety to your child's nervous system—
              before words ever reach their thinking brain.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-8 bg-accent/20 backdrop-blur-sm border-accent">
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3">Understanding the Science</h3>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              When we feel safe, our nervous system relaxes. Children read safety from our bodies before
              our words. These signals bypass anxiety and speak directly to their nervous system.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong>Key insight:</strong> Your regulation becomes their regulation. These signals aren't
              tricks—they're how mammals (including humans) co-regulate naturally.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {safetySignals.map((signal) => {
            const Icon = signal.icon;
            const isActive = activeSignal === signal.id;
            
            return (
              <Card key={signal.id} className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{signal.emoji}</span>
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{signal.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-primary">What it is</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{signal.whatItIs}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm mb-2 text-primary">Why it works</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{signal.whyItWorks}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm mb-2 text-primary">How to practice</h4>
                    <ul className="space-y-2">
                      {signal.howToPractice.map((step, idx) => (
                        <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-bold text-sm mb-2">Try it now</h4>
                    <p className="text-sm text-foreground/80 mb-4">{signal.tryItPrompt}</p>
                    
                    {isActive && practiceProgress > 0 && practiceProgress < 100 && (
                      <div className="space-y-2">
                        <Progress value={practiceProgress} className="h-2" />
                        <p className="text-xs text-center text-muted-foreground">
                          Keep practicing... {Math.ceil((100 - practiceProgress) / (100 / signal.durationSeconds))}s remaining
                        </p>
                      </div>
                    )}
                    
                    {isActive && practiceProgress === 100 && (
                      <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                          ✓ Great! Notice how this signal feels in your body.
                        </p>
                      </div>
                    )}
                    
                    {(!isActive || practiceProgress === 0) && (
                      <Button
                        onClick={() => startPractice(signal.id, signal.durationSeconds)}
                        className="w-full"
                        variant="outline"
                      >
                        Start {signal.durationSeconds}s Practice
                      </Button>
                    )}
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
