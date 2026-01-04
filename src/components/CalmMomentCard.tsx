import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';

const calmPrompts = [
  "Take 3 slow breaths together. Count them quietly in your head.",
  "Name one small good thing about today.",
  "Put your feet on the floor and notice 3 things you can see.",
  "Place a hand on your chest and feel your breathing for 30 seconds.",
  "Ask each other: what felt nice today?",
  "Close your eyes and imagine a place where you feel calm.",
  "Stretch your arms up together, then slowly let them fall.",
  "Sit quietly together and listen for 3 different sounds.",
  "Give yourself a gentle hug and take one deep breath.",
  "Notice something in the room that makes you smile.",
  "Take turns saying one thing you're grateful for.",
  "Put your hands together and feel how warm they are.",
  "Look out of a window together and describe what you see.",
  "Take one big breath in through your nose, out through your mouth.",
  "Wiggle your fingers and toes, then let them relax.",
  "Think of a happy memory and share it with each other.",
  "Notice how your body feels right now - are you comfy?",
  "Count to 5 together while breathing slowly.",
  "Give a thumbs up to something that went well today.",
  "Close your eyes and picture your favourite colour.",
  "Rest your hands on your lap and feel them get heavy.",
  "Listen to your breathing for a few seconds.",
  "Share a smile with each other - just because.",
  "Notice your feet touching the ground.",
  "Take a moment to say 'I'm okay right now.'",
  "Gently roll your shoulders back and relax them.",
  "Think of someone who makes you feel safe.",
  "Touch something soft nearby and notice how it feels.",
  "Take one slow breath and let your face relax.",
  "Look around and find something that's your favourite colour.",
  "Hold hands for a moment and feel the warmth.",
  "Take 3 breaths where the out-breath is longer than the in-breath.",
];

const getDailyCalmPrompt = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return calmPrompts[dayOfYear % calmPrompts.length];
};

export function CalmMomentCard() {
  const [completed, setCompleted] = useState(false);
  const prompt = getDailyCalmPrompt();

  const handleDoTogether = () => {
    setCompleted(true);
  };

  return (
    <Card className="p-4 sm:p-5 bg-gradient-to-br from-primary/10 to-accent/10 border border-border/30">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-base">Today's Calm Moment</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{prompt}</p>
          {!completed ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDoTogether}
              className="w-full sm:w-auto"
            >
              Do this together
            </Button>
          ) : (
            <p className="text-sm text-primary font-medium">💜 Lovely moment shared</p>
          )}
        </div>
      </div>
    </Card>
  );
}
