import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const themes = [
  { 
    id: 'classic', 
    name: 'Classic', 
    emoji: '🎨',
    colors: [
      { hsl: '248 63% 86%', label: 'Lilac' },
      { hsl: '163 40% 70%', label: 'Mint' },
      { hsl: '31 100% 88%', label: 'Peach' }
    ]
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    emoji: '🌲',
    colors: [
      { hsl: '140 40% 92%', label: 'Sage' },
      { hsl: '142 50% 45%', label: 'Green' },
      { hsl: '88 50% 55%', label: 'Fresh' }
    ]
  },
  { 
    id: 'sky', 
    name: 'Sky', 
    emoji: '✨',
    colors: [
      { hsl: '210 50% 95%', label: 'Light' },
      { hsl: '210 70% 70%', label: 'Blue' },
      { hsl: '280 50% 75%', label: 'Purple' }
    ]
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    emoji: '🌊',
    colors: [
      { hsl: '195 50% 94%', label: 'Aqua' },
      { hsl: '195 70% 60%', label: 'Ocean' },
      { hsl: '180 50% 65%', label: 'Teal' }
    ]
  },
  { 
    id: 'cozy', 
    name: 'Cozy', 
    emoji: '🏡',
    colors: [
      { hsl: '25 50% 92%', label: 'Cream' },
      { hsl: '25 60% 70%', label: 'Peach' },
      { hsl: '15 70% 65%', label: 'Terra' }
    ]
  },
];

export default function PickTheme() {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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
        await supabase
          .from('children_profiles')
          .insert({
            user_id: user.id,
            nickname,
            theme: selectedTheme
          });
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
      <Card className="border-0">
        <CardContent className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-foreground">PICK YOUR THEME 🎨</h1>
            <p className="text-lg text-foreground/70">
              Choose colors that make you feel happy and calm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 ${
                  selectedTheme === theme.id ? 'ring-4 ring-foreground border-foreground' : 'border-foreground/20'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{theme.emoji}</span>
                    <span className="font-bold text-xl">{theme.name}</span>
                    {selectedTheme === theme.id && (
                      <Check className="h-6 w-6 text-foreground ml-auto" />
                    )}
                  </div>
                  <div className="flex gap-2 h-24 rounded-2xl overflow-hidden border-2 border-foreground/10">
                    {theme.colors.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center justify-center gap-1"
                        style={{ backgroundColor: `hsl(${color.hsl})` }}
                      >
                        <span className="text-xs font-medium text-foreground/70">
                          {color.label}
                        </span>
                      </div>
                    ))}
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