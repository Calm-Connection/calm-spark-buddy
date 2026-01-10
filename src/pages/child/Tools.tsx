import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Wind, Heart, Music, Palette, Sparkles, Home, CloudRain, Snowflake, Bug, Sliders, Hand, Move, CircleDot, Sun, Clock, Bell, Lock } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { PageTransition } from '@/components/PageTransition';
import { Badge } from '@/components/ui/badge';

// MVP Tools - accessible in January MVP
const mvpTools = [
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
    icon: Palette,
    title: 'Colour Calm',
    description: 'Visualize peace with calming colors',
    path: '/child/tools/colour-calm',
  },
  {
    icon: Heart,
    title: 'Gentle Reflections',
    description: "Check in with how you're feeling",
    path: '/child/tools/gentle-reflections',
  },
  {
    icon: Sparkles,
    title: 'Talk to Wendy',
    description: 'Chat with your AI friend',
    path: '/child/wendy-chat',
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
];

// Coming Soon Tools - parked for future release (content preserved)
const comingSoonTools = [
  {
    icon: Music,
    title: 'Thought Clouds',
    description: 'Coming soon!',
    path: '/child/tools/thought-clouds',
  },
  {
    icon: CloudRain,
    title: 'Blow Away Worry Clouds',
    description: 'Coming soon!',
    path: '/child/tools/blow-worry-clouds',
  },
  {
    icon: Home,
    title: 'Create My Calm Corner',
    description: 'Coming soon!',
    path: '/child/tools/calm-corner',
  },
  {
    icon: Sliders,
    title: 'Mood Music Mixer',
    description: 'Coming soon!',
    path: '/child/tools/mood-music-mixer',
  },
  {
    icon: Bell,
    title: 'Gentle Reminder Bell',
    description: 'Coming soon!',
    path: '/child/tools/gentle-bell',
  },
];

export default function Tools() {
  const navigate = useNavigate();
  const reduceMotion = useReduceMotion();

  // Get stagger class for card animations
  const getStaggerClass = (index: number) => {
    if (reduceMotion) return '';
    const staggerNum = Math.min(index + 1, 8);
    return `animate-fade-up animate-stagger-${staggerNum}`;
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent/5 to-background pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/home')} className="h-10 w-10 hover:bg-interactive-accent/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Calming Tools 🧘
          </h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Try something gentle to help you feel calm and centered
        </p>

        {/* MVP Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mvpTools.map((tool, index) => {
            const Icon = tool.icon;
            const decorativeIcons = ['cloud', 'sparkles', 'leaf', 'star', 'flower', 'sun'] as const;
            return (
              <Card
                key={tool.title}
                className={`relative overflow-hidden p-4 sm:p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-soft-lg bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 group ${getStaggerClass(index)}`}
                onClick={() => navigate(tool.path)}
              >
                <DecorativeIcon 
                  icon={decorativeIcons[index % decorativeIcons.length]} 
                  position="top-right" 
                  opacity={0.08} 
                  className="group-hover:opacity-15 transition-opacity"
                />
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-interactive-accent/10 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                    <Icon className="h-7 w-7 text-interactive-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg truncate">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-2">{tool.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        {comingSoonTools.length > 0 && (
          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground/70">Coming Soon 🔜</h2>
              <Badge variant="secondary" className="text-xs">More tools on the way!</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comingSoonTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card
                    key={tool.title}
                    className="relative overflow-hidden p-4 sm:p-5 opacity-50 cursor-not-allowed bg-muted/30 border-muted"
                  >
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg truncate text-muted-foreground">{tool.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{tool.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav role="child" />
    </div>
    </PageTransition>
  );
}
