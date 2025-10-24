import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Wind, Heart, Music, Palette, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const tools = [
  {
    icon: Wind,
    title: 'Breathing Exercise',
    description: 'Calm your mind with gentle breathing',
    path: null,
  },
  {
    icon: Heart,
    title: 'Guided Meditation',
    description: 'Short, peaceful meditation for you',
    path: null,
  },
  {
    icon: Music,
    title: 'Calming Sounds',
    description: 'Soothing music and nature sounds',
    path: null,
  },
  {
    icon: Palette,
    title: 'Drawing Space',
    description: 'Express yourself through art',
    path: null,
  },
  {
    icon: Sparkles,
    title: 'Talk to Wendy',
    description: 'Chat with your AI friend',
    path: '/child/wendy-chat',
  },
];

export default function Tools() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Calming Tools 🧘</h1>
        </div>

        <p className="text-muted-foreground">
          Choose a tool to help you feel calm and centered
        </p>

        <div className="space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.title}
                className="p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-accent/20 to-warm/20"
                onClick={() => tool.path && navigate(tool.path)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                {!tool.path && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">Coming soon</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
