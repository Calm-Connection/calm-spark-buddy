import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Wind, Heart, Music, Palette, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const tools = [
  {
    icon: Wind,
    title: 'Breathing Space',
    description: 'Calm your mind with gentle breathing',
    path: '/child/tools/breathing-space',
  },
  {
    icon: Heart,
    title: '5-4-3-2-1 Grounding',
    description: 'Feel present and safe with your senses',
    path: '/child/tools/grounding-game',
  },
  {
    icon: Music,
    title: 'Thought Clouds',
    description: 'Work through big feelings gently',
    path: '/child/tools/thought-clouds',
  },
  {
    icon: Palette,
    title: 'Colour Calm',
    description: 'Visualize peace with calming colors',
    path: '/child/tools/colour-calm',
  },
  {
    icon: Heart,
    title: 'Gentle Reflections',
    description: 'Check in with how you\'re feeling',
    path: '/child/tools/gentle-reflections',
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent/5 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/home')} className="hover:bg-interactive-accent/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Calming Tools 🧘
          </h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Choose a tool to help you feel calm and centered
        </p>

        <div className="space-y-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const decorativeIcons = ['cloud', 'sparkles', 'leaf', 'star', 'flower', 'sun'] as const;
            return (
              <Card
                key={tool.title}
                className="relative overflow-hidden p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-soft-lg bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 group"
                onClick={() => navigate(tool.path)}
              >
                <DecorativeIcon 
                  icon={decorativeIcons[index % decorativeIcons.length]} 
                  position="top-right" 
                  opacity={0.08} 
                  className="group-hover:opacity-15 transition-opacity"
                />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-interactive-accent/10 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="h-6 w-6 text-interactive-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{tool.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
