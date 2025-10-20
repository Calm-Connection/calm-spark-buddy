import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { Wind, Heart, Music, Palette, Sparkles } from 'lucide-react';

const tools = [
  {
    icon: Wind,
    title: 'Breathing Exercise',
    description: 'Calm your mind with gentle breathing',
    color: 'bg-blue-200/50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Heart,
    title: 'Guided Meditation',
    description: 'Short, peaceful meditation for you',
    color: 'bg-purple-200/50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Music,
    title: 'Calming Sounds',
    description: 'Soothing music and nature sounds',
    color: 'bg-green-200/50',
    iconColor: 'text-green-600',
  },
  {
    icon: Palette,
    title: 'Drawing Space',
    description: 'Express yourself through art',
    color: 'bg-yellow-200/50',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Sparkles,
    title: 'Talk to Wendy',
    description: 'Chat with your AI friend',
    color: 'bg-pink-200/50',
    iconColor: 'text-pink-600',
    path: '/child/wendy-chat',
  },
];

export default function Tools() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2">Calming Tools 🧘</h1>
          <p className="text-muted-foreground">
            Find peace and calm whenever you need it
          </p>
        </div>

        <div className="grid gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.title}
                className={`p-6 cursor-pointer transition-all hover:scale-[1.02] ${tool.color}`}
                onClick={() => tool.path && navigate(tool.path)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/50 flex items-center justify-center">
                    <Icon className={`h-6 w-6 ${tool.iconColor}`} />
                  </div>
                  <div>
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

      <INeedHelpButton />
    </div>
  );
}