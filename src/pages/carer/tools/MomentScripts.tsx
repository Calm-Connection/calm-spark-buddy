import { useState } from 'react';
import { ArrowLeft, Copy, Check, Sun, School, Moon, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { BottomNav } from '@/components/BottomNav';
import { toast } from 'sonner';

const scriptCategories = [
  {
    id: 'morning',
    title: 'Morning Anxiety',
    icon: Sun,
    description: 'Scripts for waking up worried',
    tip: 'Keep your voice soft and unhurried. Avoid rushing or dismissing their feelings.',
    scripts: [
      "I know mornings feel hard. I'm right here with you.",
      "Your body is telling you something feels scary. Let's breathe together first.",
      "We don't have to rush. What's one small thing we can do first?",
      "I believe you when you say it's hard. Let's take it one step at a time.",
      "You're safe. We'll figure this out together."
    ]
  },
  {
    id: 'school',
    title: 'School Refusal',
    icon: School,
    description: 'Scripts for not wanting to go to school',
    tip: 'Validate first, problem-solve second. Stay calm even when they escalate.',
    scripts: [
      "I can see you're really worried about school. Tell me what feels hardest.",
      "Your feelings are real and important. Let's work out what would help.",
      "We're a team. What would make this feel even a tiny bit easier?",
      "I'm not going to force you. But I do need to understand what's happening.",
      "School feels big right now. Let's break it down into smaller pieces together."
    ]
  },
  {
    id: 'bedtime',
    title: 'Bedtime Worries',
    icon: Moon,
    description: 'Scripts for nighttime fears',
    tip: 'Nighttime anxiety is real. Slow down, get cozy, and stay present with them.',
    scripts: [
      "I'm here. You're safe. Nothing needs to be fixed right now.",
      "Your worries feel big at night. Let's keep your body company instead of your thoughts.",
      "I'm going to stay right here while you settle. You're not alone.",
      "Sometimes nighttime makes everything feel scarier. That's normal. I've got you.",
      "Let's think of three things that felt good today. I'll start..."
    ]
  },
  {
    id: 'separation',
    title: 'Separation Anxiety',
    icon: Heart,
    description: 'Scripts for leaving or being left',
    tip: 'Be honest about leaving. Sneak-outs make it worse. Stay matter-of-fact and warm.',
    scripts: [
      "I'm going to [place]. I'll be back at [time]. You're safe with [person].",
      "It's hard when we're apart. And I always come back. Always.",
      "Your body is scared I won't return. But look—every time, I do.",
      "Let's make a plan for what you'll do while I'm gone. What sounds good?",
      "I'll think of you while I'm away. You can think of me too. We're connected even apart."
    ]
  },
  {
    id: 'big-feelings',
    title: 'When Feelings Feel Big',
    icon: Zap,
    description: 'De-escalation scripts',
    tip: 'Lower your voice, slow your movements, offer space. Do not reason or lecture now.',
    scripts: [
      "I can see you're really upset. I'm here.",
      "You're safe. I'm not angry. Take your time.",
      "Do you need space, or do you need me close? You choose.",
      "Let's just breathe. Nothing else matters right now.",
      "I'm going to stay calm so your body can borrow my calm."
    ]
  }
];

export default function MomentScripts() {
  const navigate = useNavigate();
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopiedScript(script);
    toast.success('Script copied to clipboard');
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
      <DecorativeIcon icon="cloud" position="top-right" opacity={0.1} />
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
            <CardTitle className="text-3xl">In-the-Moment Scripts</CardTitle>
            <CardDescription>
              Ready-to-use calming phrases for specific anxiety situations. These scripts prioritise
              connection over correction and help your child feel safe when big emotions arise.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-6 bg-accent/20 backdrop-blur-sm border-accent">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong>How to use:</strong> These aren't magic words—they're offers of safety. Your tone,
              pace, and body language matter more than getting the words perfect. Stay regulated yourself,
              and your presence will do most of the work.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {scriptCategories.map((category) => {
            const Icon = category.icon;
            return (
              <AccordionItem key={category.id} value={category.id} className="border-none">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <div className="text-left">
                        <div className="font-bold text-lg">{category.title}</div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-4 space-y-4">
                      <div className="bg-accent/20 rounded-lg p-4 mb-4">
                        <p className="text-sm text-foreground/80">
                          <strong>💡 Tip:</strong> {category.tip}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {category.scripts.map((script, idx) => (
                          <div
                            key={idx}
                            className="bg-muted/30 rounded-lg p-4 flex items-start justify-between gap-3 group"
                          >
                            <p className="text-sm leading-relaxed flex-1">"{script}"</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyScript(script)}
                              className="shrink-0"
                            >
                              {copiedScript === script ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
