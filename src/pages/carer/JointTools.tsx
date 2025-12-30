import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, MessageCircle, Music, Smile } from 'lucide-react';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { BottomNav } from '@/components/BottomNav';

export default function JointTools() {
  const navigate = useNavigate();

  const tools = [
    {
      icon: Heart,
      title: 'Gratitude Circle',
      description: 'Take turns sharing three things you\'re grateful for today',
      color: 'bg-primary/20 hover:bg-primary/30 text-primary',
      path: '/carer/tools/joint/gratitude-circle',
    },
    {
      icon: MessageCircle,
      title: 'Feelings Check-in',
      description: 'Use emotion cards to talk about how you\'re both feeling',
      color: 'bg-accent/30 hover:bg-accent/40 text-accent-foreground',
      path: '/carer/tools/joint/feelings-checkin',
    },
    {
      icon: Smile,
      title: 'Happy Memory Jar',
      description: 'Write down a happy memory together and add it to your collection',
      color: 'bg-secondary/20 hover:bg-secondary/30 text-secondary',
      path: '/carer/tools/joint/happy-memory-jar',
    },
    {
      icon: Music,
      title: 'Calm Down Corner',
      description: 'Create a cozy space together with calming activities',
      color: 'bg-warm/30 hover:bg-warm/40 text-foreground',
      path: '/carer/tools/joint/calm-down-corner',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Joint Tools 💫</h1>
            <p className="text-muted-foreground mt-1">Activities to do together</p>
          </div>
        </div>

        <Card className="relative p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-interactive-accent to-primary bg-clip-text text-transparent">Strengthen Your Bond</h2>
          <p className="text-muted-foreground">
            These activities help you connect, communicate, and build emotional resilience together.
          </p>
        </Card>

        <div className="grid gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.title}
                className={`p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-soft ${tool.color} border-interactive-accent/10 cursor-pointer`}
                onClick={() => navigate(tool.path)}
              >
                <div className="flex items-start gap-4">
                  <Icon className="h-10 w-10 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
                    <p className="text-sm opacity-90">{tool.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="relative p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-interactive-accent/10 shadow-soft">
          <DecorativeIcon icon="sparkles" position="top-left" opacity={0.08} />
          <h3 className="font-bold mb-2">💡 Tip</h3>
          <p className="text-sm text-muted-foreground">
            Set aside 10-15 minutes of uninterrupted time for these activities. Make it a regular routine 
            to help your child feel safe and supported.
          </p>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
