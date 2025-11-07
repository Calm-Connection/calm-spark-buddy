import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb } from 'lucide-react';

interface TechniqueGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechniqueGuideModal({ open, onOpenChange }: TechniqueGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="h-6 w-6 text-primary" />
            Understanding Emotional Support Techniques
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            These evidence-based techniques can help support your child's emotional wellbeing. Each one is designed to be simple, calming, and effective.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="breathing">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌬️</span>
                  <span className="font-semibold">Breathing Exercises</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">What it is:</p>
                  <p className="text-sm text-muted-foreground">
                    Slow, intentional breathing to activate the body's natural calm response.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">When to use it:</p>
                  <p className="text-sm text-muted-foreground">
                    When your child feels anxious, worried, overwhelmed, or needs to calm down before bed.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">How to do it together:</p>
                  <p className="text-sm text-muted-foreground">
                    Sit side by side and breathe slowly together - inhale for 4 counts, hold for 4, exhale for 6. Try "breathing with nature" by imagining ocean waves or tree branches swaying.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Why it works:</p>
                  <p className="text-sm text-muted-foreground">
                    Slowing your breath signals safety to the nervous system and reduces the body's stress response (NHS evidence-based).
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="grounding">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <span className="font-semibold">Grounding Techniques</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">What it is:</p>
                  <p className="text-sm text-muted-foreground">
                    Using the 5 senses to bring attention back to the present moment and break worry cycles.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">When to use it:</p>
                  <p className="text-sm text-muted-foreground">
                    During worry spirals, panic, feeling "stuck in their head," or when emotions feel overwhelming.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">How to do it together:</p>
                  <p className="text-sm text-muted-foreground">
                    "Let's name 5 things we can see, 4 we can touch, 3 we can hear, 2 we can smell, and 1 we can taste." Go slowly and gently.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Why it works:</p>
                  <p className="text-sm text-muted-foreground">
                    Interrupts anxious thinking by anchoring attention to the present moment rather than worries about the future (CAMHS-approved).
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reflection">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💭</span>
                  <span className="font-semibold">Gentle Reflection</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">What it is:</p>
                  <p className="text-sm text-muted-foreground">
                    Creating space for your child to process and express their feelings without judgment.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">When to use it:</p>
                  <p className="text-sm text-muted-foreground">
                    After school, during quiet moments, or when they seem like they have something on their mind.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">How to do it together:</p>
                  <p className="text-sm text-muted-foreground">
                    Ask open-ended questions like "What was the best part of your day?" or "If today had a color, what would it be?" Listen without trying to fix or solve.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Why it works:</p>
                  <p className="text-sm text-muted-foreground">
                    Helps children develop emotional awareness and feel heard, building trust and communication patterns.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creative">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  <span className="font-semibold">Creative Expression</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">What it is:</p>
                  <p className="text-sm text-muted-foreground">
                    Using drawing, coloring, or creative activities to express emotions that are hard to put into words.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">When to use it:</p>
                  <p className="text-sm text-muted-foreground">
                    When your child struggles to verbalize feelings or needs a calming, focused activity.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">How to do it together:</p>
                  <p className="text-sm text-muted-foreground">
                    Provide art supplies and sit nearby doing your own creative activity. Let them lead - don't direct or judge. Try "draw your day" or "color your mood."
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Why it works:</p>
                  <p className="text-sm text-muted-foreground">
                    Creative expression activates different parts of the brain and provides a safe outlet for difficult emotions.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="connection">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💜</span>
                  <span className="font-semibold">Quality Connection Time</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">What it is:</p>
                  <p className="text-sm text-muted-foreground">
                    Dedicated time together doing activities your child enjoys, without screens or distractions.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">When to use it:</p>
                  <p className="text-sm text-muted-foreground">
                    Regularly (even 10-15 minutes daily makes a difference) and especially during difficult periods.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">How to do it together:</p>
                  <p className="text-sm text-muted-foreground">
                    Let your child choose the activity. Be fully present - put away phones. Follow their lead and show genuine interest.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Why it works:</p>
                  <p className="text-sm text-muted-foreground">
                    Strengthens emotional bonds and creates a safe space for natural conversations. Children often open up during shared activities.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="routine">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏰</span>
                  <span className="font-semibold">Calming Routines</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">What it is:</p>
                  <p className="text-sm text-muted-foreground">
                    Predictable, soothing sequences of activities that signal safety and calm to the nervous system.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">When to use it:</p>
                  <p className="text-sm text-muted-foreground">
                    Before bed, after school transitions, or during particularly stressful periods.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">How to do it together:</p>
                  <p className="text-sm text-muted-foreground">
                    Create a simple sequence: snack + calm activity + breathing + bedtime. Keep it consistent and gentle. Involve your child in designing it.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Why it works:</p>
                  <p className="text-sm text-muted-foreground">
                    Predictability reduces anxiety. Routines provide structure and security, especially during uncertain times.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-accent/20 rounded-lg p-4 mt-6">
            <p className="text-sm font-semibold mb-2">💡 Remember:</p>
            <p className="text-sm text-muted-foreground">
              Every child is different. Try different techniques and see what resonates with your child. The most important thing is your calm, supportive presence.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
