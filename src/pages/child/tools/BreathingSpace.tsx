import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Waves, Cloud, Trees, Star, Flower, Rainbow, Heart, Plus, Trash2, StarOff } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [customSpaces, setCustomSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadCustomSpaces();
  }, [user]);

  const loadCustomSpaces = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('children_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      const { data, error} = await supabase
        .from('custom_breathing_spaces')
        .select('*')
        .eq('child_id', profile.id)
        .order('is_favorite', { ascending: false })
        .order('last_used_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setCustomSpaces(data || []);
    } catch (error) {
      console.error('Error loading custom spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_breathing_spaces')
        .update({ is_favorite: !currentFavorite })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentFavorite ? "Removed from favorites" : "Added to favorites",
        description: currentFavorite ? "Space unfavorited" : "Space favorited ⭐"
      });

      loadCustomSpaces();
    } catch (error: any) {
      toast({
        title: "Couldn't update favorite",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSpaceToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!spaceToDelete) return;
    
    try {
      const { error } = await supabase
        .from('custom_breathing_spaces')
        .delete()
        .eq('id', spaceToDelete.id);

      if (error) throw error;

      toast({
        title: "Space deleted",
        description: `"${spaceToDelete.name}" has been removed`
      });

      loadCustomSpaces();
    } catch (error: any) {
      toast({
        title: "Couldn't delete space",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSpaceToDelete(null);
    }
  };

  const themeEmojis: Record<string, string> = {
    ocean: '🌊',
    cloud: '☁️',
    forest: '🌲',
    star: '⭐',
    garden: '🌼',
    rainbow: '🌈',
    sunset: '🌅',
    space: '🌌',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/10 to-background pb-20 relative">
      <DecorativeIcon icon="cloud" position="top-right" opacity={0.08} />
      <DecorativeIcon icon="sparkles" position="bottom-left" opacity={0.06} />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools')} className="hover:bg-interactive-accent/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
<h1 className="text-2xl title-gradient-underline">
            Breathing Space 🌬️
          </h1>
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 animate-fade-in shadow-soft-lg border-interactive-accent/20">
          <h2 className="text-lg font-bold mb-2">Welcome to Your Breathing Space</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Pick a breathing world that feels good to you right now. Each one will help you feel calmer and more peaceful.
          </p>
        </Card>

        {/* Create Your Own Section */}
        <Card 
          className="p-6 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border-2 border-dashed border-interactive-accent cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-soft hover:shadow-soft-lg"
          onClick={() => navigate('/child/tools/breathing/create')}
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Create Your Own ✨</h3>
              <p className="text-sm text-muted-foreground">
                Mix and match scenes and sounds to make your perfect calm space
              </p>
            </div>
          </div>
        </Card>

        {/* Custom Spaces Section */}
        {!loading && customSpaces.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">My Custom Spaces 💫</h3>
            <div className="grid gap-3">
              {customSpaces.map((space) => (
                <Card 
                  key={space.id}
                  className={`p-4 hover:scale-105 transition-transform cursor-pointer bg-background/60 backdrop-blur ${
                    space.is_favorite ? 'border-2 border-primary/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-12 w-12 rounded-full flex items-center justify-center text-2xl bg-primary/10"
                      onClick={() => navigate(`/child/tools/breathing/custom/${space.id}`)}
                    >
                      {themeEmojis[space.visual_theme] || '✨'}
                    </div>
                    <div 
                      className="flex-1"
                      onClick={() => navigate(`/child/tools/breathing/custom/${space.id}`)}
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        {space.name}
                        {space.is_favorite && <span className="text-xs">⭐</span>}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {space.visual_theme} • {space.sound_theme}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(space.id, space.is_favorite);
                      }}
                      title={space.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {space.is_favorite ? (
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(space.id, space.name);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Breathing Space?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{spaceToDelete?.name}"? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <h3 className="text-lg font-semibold">Preset Breathing Worlds 🌍</h3>

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
        
        <div className="mt-4">
          <DisclaimerCard variant="tool-limitation" size="small" />
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
