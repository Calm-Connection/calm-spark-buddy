import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { ThemePreview } from '@/components/ThemePreview';
import { useIsMobile } from '@/hooks/use-mobile';

const themes = [
  { 
    id: 'classic', 
    name: 'Classic', 
    emoji: '🎨',
    description: 'Soft and gentle colors',
    themeColors: {
      background: '246 70% 90%',
      primary: '246 70% 90%',
      secondary: '163 40% 69%',
      accent: '31 97% 88%'
    }
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    emoji: '🌲',
    description: 'Nature and calm greens',
    themeColors: {
      background: '140 40% 92%',
      primary: '142 50% 45%',
      secondary: '88 50% 55%',
      accent: '40 60% 60%'
    }
  },
  { 
    id: 'sky', 
    name: 'Sky', 
    emoji: '✨',
    description: 'Light and dreamy blues',
    themeColors: {
      background: '210 50% 95%',
      primary: '210 70% 70%',
      secondary: '200 60% 80%',
      accent: '280 50% 75%'
    }
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    emoji: '🌊',
    description: 'Cool and peaceful waters',
    themeColors: {
      background: '195 50% 94%',
      primary: '195 70% 60%',
      secondary: '180 50% 65%',
      accent: '200 60% 75%'
    }
  },
  { 
    id: 'cozy', 
    name: 'Cozy', 
    emoji: '🏡',
    description: 'Warm and comfy tones',
    themeColors: {
      background: '25 50% 92%',
      primary: '25 60% 70%',
      secondary: '35 50% 75%',
      accent: '15 70% 65%'
    }
  },
];

export default function PickTheme() {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleContinue = async () => {
    if (!selectedTheme || !user) return;
    
    setLoading(true);
    try {
      localStorage.setItem('selectedTheme', selectedTheme);
      
      const { data: existingProfile } = await supabase
        .from('children_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingProfile) {
        await supabase
          .from('children_profiles')
          .update({ theme: selectedTheme })
          .eq('user_id', user.id);
      } else {
        const nickname = localStorage.getItem('pendingNickname') || 'Friend';
        const linkedCarerId = localStorage.getItem('linkedCarerId');
        
        await supabase
          .from('children_profiles')
          .insert({
            user_id: user.id,
            nickname,
            theme: selectedTheme,
            linked_carer_id: linkedCarerId || null
          });
        
        // Clean up localStorage
        if (linkedCarerId) {
          localStorage.removeItem('linkedCarerId');
        }
      }
      
      navigate('/child/create-avatar');
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to save theme. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <Card className="border-0 shadow-soft-lg relative overflow-hidden">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
        <DecorativeIcon icon="leaf" position="bottom-left" opacity={0.08} />
        <CardContent className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-foreground bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              PICK YOUR THEME 🎨
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Choose colors that make you feel happy and calm
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-soft-lg border-interactive-accent/20 ${
                  selectedTheme === theme.id ? 'ring-2 ring-interactive-accent shadow-soft-lg scale-[1.02]' : 'shadow-soft'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <CardContent className="space-y-3 p-3 sm:p-4">
                  {/* Theme Preview - Visual focal point */}
                  <ThemePreview 
                    theme={theme.themeColors}
                    emoji={theme.emoji}
                    size={isMobile ? 'sm' : 'md'}
                  />
                  
                  {/* Compact header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{theme.emoji}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{theme.name}</span>
                        <span className="text-xs text-muted-foreground">{theme.description}</span>
                      </div>
                    </div>
                    {selectedTheme === theme.id && (
                      <Check className="h-5 w-5 text-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handleContinue}
            variant="gradient"
            size="lg"
            className="w-full" 
            disabled={!selectedTheme || loading}
          >
            {loading ? 'SAVING...' : 'NEXT'}
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}