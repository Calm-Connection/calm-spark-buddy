import { Card } from '@/components/ui/card';
import { ThemeName, applyTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

interface Theme {
  id: ThemeName;
  name: string;
  emoji: string;
  colors: Array<{ hsl: string; label: string }>;
}

const themes: Theme[] = [
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    colors: [
      { hsl: '140 40% 92%', label: 'Background' },
      { hsl: '142 50% 45%', label: 'Primary' },
      { hsl: '88 50% 55%', label: 'Secondary' },
      { hsl: '40 60% 60%', label: 'Accent' },
    ],
  },
  {
    id: 'sky',
    name: 'Sky',
    emoji: '✨',
    colors: [
      { hsl: '210 50% 95%', label: 'Background' },
      { hsl: '210 70% 70%', label: 'Primary' },
      { hsl: '200 60% 80%', label: 'Secondary' },
      { hsl: '280 50% 75%', label: 'Accent' },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    colors: [
      { hsl: '195 50% 94%', label: 'Background' },
      { hsl: '195 70% 60%', label: 'Primary' },
      { hsl: '180 50% 65%', label: 'Secondary' },
      { hsl: '200 60% 75%', label: 'Accent' },
    ],
  },
  {
    id: 'cozy',
    name: 'Cozy',
    emoji: '🏡',
    colors: [
      { hsl: '25 50% 92%', label: 'Background' },
      { hsl: '25 60% 70%', label: 'Primary' },
      { hsl: '35 50% 75%', label: 'Secondary' },
      { hsl: '15 70% 65%', label: 'Accent' },
    ],
  },
  {
    id: 'classic',
    name: 'Classic',
    emoji: '🎨',
    colors: [
      { hsl: '248 60% 94%', label: 'Background' },
      { hsl: '248 63% 76%', label: 'Primary' },
      { hsl: '163 40% 70%', label: 'Secondary' },
      { hsl: '31 100% 88%', label: 'Accent' },
    ],
  },
];

interface ThemeSelectorProps {
  currentTheme: ThemeName | null;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const handleThemeSelect = async (themeId: ThemeName) => {
    if (!user) return;

    // Apply theme immediately
    applyTheme(themeId);
    onThemeChange(themeId);

    // Save to database for child accounts
    if (userRole === 'child') {
      const { error } = await supabase
        .from('children_profiles')
        .update({ theme: themeId })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to save theme preference',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Theme updated',
          description: `${themes.find(t => t.id === themeId)?.name} theme applied`,
        });
      }
    } else {
      // For carers, just apply locally
      toast({
        title: 'Theme updated',
        description: `${themes.find(t => t.id === themeId)?.name} theme applied`,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`p-4 cursor-pointer transition-all hover:scale-105 relative ${
              currentTheme === theme.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            {currentTheme === theme.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{theme.emoji}</span>
              <h3 className="font-bold text-lg dark:text-foreground">{theme.name}</h3>
            </div>
            <div className="flex gap-2">
              {theme.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="h-8 flex-1 rounded"
                  style={{ backgroundColor: `hsl(${color.hsl})` }}
                  title={color.label}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
