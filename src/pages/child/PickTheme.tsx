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
  { id: 'calm-ocean', name: 'Calm Ocean', colors: ['bg-blue-200', 'bg-blue-300', 'bg-blue-400'] },
  { id: 'forest-green', name: 'Forest Green', colors: ['bg-green-200', 'bg-green-300', 'bg-green-400'] },
  { id: 'sunset-pink', name: 'Sunset Pink', colors: ['bg-pink-200', 'bg-pink-300', 'bg-pink-400'] },
  { id: 'lavender-dream', name: 'Lavender Dream', colors: ['bg-purple-200', 'bg-purple-300', 'bg-purple-400'] },
  { id: 'sunshine-yellow', name: 'Sunshine Yellow', colors: ['bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400'] },
  { id: 'peachy-warm', name: 'Peachy Warm', colors: ['bg-orange-200', 'bg-orange-300', 'bg-orange-400'] },
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-0 ${
                  selectedTheme === theme.id ? 'ring-4 ring-primary' : ''
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex gap-1 h-20 rounded-2xl overflow-hidden">
                    {theme.colors.map((color, idx) => (
                      <div key={idx} className={`flex-1 ${color}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base">{theme.name}</span>
                    {selectedTheme === theme.id && (
                      <Check className="h-6 w-6 text-primary" />
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