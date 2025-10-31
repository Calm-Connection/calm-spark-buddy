import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Waves, Cloud, Trees, Star, Flower, Rainbow, Heart } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const breathingExercises = [
  {
    id: 'ocean',
    name: 'Ocean Breathing',
    icon: Waves,
    emoji: '🌊',
    color: 'from-blue-400/20 to-cyan-400/20',
    description: 'Calm like the sea',
    path: '/child/tools/breathing/ocean'
  },
  {
    id: 'cloud',
    name: 'Cloud Breathing',
    icon: Cloud,
    emoji: '☁️',
    color: 'from-sky-300/20 to-blue-300/20',
    description: 'Float like clouds',
    path: '/child/tools/breathing/cloud'
  },
  {
    id: 'forest',
    name: 'Forest Breathing',
    icon: Trees,
    emoji: '🌿',
    color: 'from-green-400/20 to-emerald-400/20',
    description: 'Grounded like a tree',
    path: '/child/tools/breathing/forest'
  },
  {
    id: 'star',
    name: 'Star Breathing',
    icon: Star,
    emoji: '🌙',
    color: 'from-indigo-400/20 to-purple-400/20',
    description: 'Shine in the dark',
    path: '/child/tools/breathing/star'
  },
  {
    id: 'garden',
    name: 'Magic Garden',
    icon: Flower,
    emoji: '🌸',
    color: 'from-pink-300/20 to-rose-300/20',
    description: 'Bloom beautifully',
    path: '/child/tools/breathing/garden'
  },
  {
    id: 'rainbow',
    name: 'Rainbow Rhythm',
    icon: Rainbow,
    emoji: '🌈',
    color: 'from-primary/20 to-secondary/20',
    description: 'Quick color reset',
    path: '/child/tools/breathing/rainbow'
  },
  {
    id: 'animal',
    name: 'Animal Breaths',
    icon: Heart,
    emoji: '🐾',
    color: 'from-warm/20 to-dustyRose/20',
    description: 'Playful breathing',
    path: '/child/tools/breathing/animal'
  }
];

export default function BreathingSpace() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Breathing Space 🌬️</h1>
        </div>

        <Card className="p-6 bg-gradient-to-br from-accent/20 to-warm/20 animate-fade-in">
          <h2 className="text-lg font-bold mb-2">Welcome to Your Breathing Space</h2>
          <p className="text-sm text-muted-foreground">
            Pick a breathing world that feels good to you right now. Each one will help you feel calmer and more peaceful.
          </p>
        </Card>

        <div className="grid gap-4">
          {breathingExercises.map((exercise, index) => {
            const Icon = exercise.icon;
            return (
              <Card
                key={exercise.id}
                className={`p-6 bg-gradient-to-br ${exercise.color} cursor-pointer hover-scale transition-all animate-fade-in border-2 border-transparent hover:border-primary/30`}
                onClick={() => navigate(exercise.path)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{exercise.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {exercise.name}
                      <Icon className="h-4 w-4 opacity-50" />
                    </h3>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-4 bg-muted/20">
          <p className="text-sm text-muted-foreground text-center">
            💡 Tip: Try different breathing worlds to find what helps you feel calmest
          </p>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
