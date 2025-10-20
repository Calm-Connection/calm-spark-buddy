import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, MessageCircle, Music, Smile } from 'lucide-react';

export default function JointTools() {
  const navigate = useNavigate();

  const tools = [
    {
      icon: Heart,
      title: 'Gratitude Circle',
      description: 'Take turns sharing three things you\'re grateful for today',
      color: 'bg-primary/20 hover:bg-primary/30 text-primary',
    },
    {
      icon: MessageCircle,
      title: 'Feelings Check-in',
      description: 'Use emotion cards to talk about how you\'re both feeling',
      color: 'bg-accent/30 hover:bg-accent/40 text-accent-foreground',
    },
    {
      icon: Smile,
      title: 'Happy Memory Jar',
      description: 'Write down a happy memory together and add it to your collection',
      color: 'bg-secondary/20 hover:bg-secondary/30 text-secondary',
    },
    {
      icon: Music,
      title: 'Calm Down Corner',
      description: 'Create a cozy space together with calming activities',
      color: 'bg-warm/30 hover:bg-warm/40 text-foreground',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6">
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

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <h2 className="text-xl font-bold mb-2">Strengthen Your Bond</h2>
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
                className={`p-6 transition-all hover:scale-[1.02] ${tool.color}`}
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

        <Card className="p-6 bg-accent/10">
          <h3 className="font-bold mb-2">💡 Tip</h3>
          <p className="text-sm text-muted-foreground">
            Set aside 10-15 minutes of uninterrupted time for these activities. Make it a regular routine 
            to help your child feel safe and supported.
          </p>
        </Card>
      </div>
    </div>
  );
}
