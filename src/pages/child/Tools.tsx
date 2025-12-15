import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Wind, Heart, Music, Palette, Sparkles, Home, CloudRain, Snowflake, Bug, Sliders, Hand, Move, CircleDot, Sun, Clock, Bell } from 'lucide-react';
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
  {
    icon: Home,
    title: 'Create My Calm Corner',
    description: 'Design your own peaceful space',
    path: '/child/tools/calm-corner',
  },
  {
    icon: CloudRain,
    title: 'Blow Away Worry Clouds',
    description: 'Clear your worries gently',
    path: '/child/tools/blow-worry-clouds',
  },
  {
    icon: Snowflake,
    title: 'Cool Down Cube',
    description: 'Calm down with a melting ice cube',
    path: '/child/tools/cool-down-cube',
  },
  {
    icon: Bug,
    title: 'Follow the Calm Creature',
    description: 'Copy calming movements',
    path: '/child/tools/calm-creature',
  },
  {
    icon: Sliders,
    title: 'Mood Music Mixer',
    description: 'Mix your own calming sounds',
    path: '/child/tools/mood-music-mixer',
  },
  {
    icon: Hand,
    title: 'Hand Trace Breathing',
    description: 'Breathe along with your hand',
    path: '/child/tools/hand-trace-breathing',
  },
  {
    icon: Move,
    title: 'Wiggle Reset',
    description: 'Quick physical reset',
    path: '/child/tools/wiggle-reset',
  },
  {
    icon: CircleDot,
    title: 'Spin the Calm Wheel',
    description: 'Try a random calming activity',
    path: '/child/tools/calm-wheel',
  },
  {
    icon: Sun,
    title: 'Warm Hands Trick',
    description: 'Warm your hands with sunshine',
    path: '/child/tools/warm-hands',
  },
  {
    icon: Clock,
    title: 'Slow Mo Mode',
    description: 'Slow down and breathe',
    path: '/child/tools/slow-mo-mode',
  },
  {
    icon: Bell,
    title: 'Gentle Reminder Bell',
    description: 'Ring the calming bell',
    path: '/child/tools/gentle-bell',
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
          Try something gentle to help you feel calm and centered
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
