import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Sparkles, Wrench, Settings } from 'lucide-react';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { applyTheme, type ThemeName } from '@/hooks/useTheme';
import { FloatingElements } from '@/components/FloatingElements';

const affirmations = [
  "You are brave and strong 💪",
  "Your feelings matter 💜",
  "You are doing great today ⭐",
  "It's okay to ask for help 🤗",
  "You make the world brighter ☀️",
];

export default function ChildHome() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('classic');
  const [affirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('children_profiles')
        .select('nickname, avatar_json, theme')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setNickname(data.nickname);
        setAvatarData(data.avatar_json);
        
        // Apply saved theme
        if (data.theme) {
          applyTheme(data.theme as ThemeName);
          setCurrentTheme(data.theme as ThemeName);
        }
      }
    };

    loadProfile();
  }, [user]);

  const menuItems = [
    { icon: BookOpen, label: 'My Journal', path: '/child/journal-entry', color: 'bg-primary/20 hover:bg-primary/30 text-primary' },
    { icon: Sparkles, label: 'Talk to Wendy', path: '/child/wendy-chat', color: 'bg-accent/30 hover:bg-accent/40 text-accent-foreground' },
    { icon: Wrench, label: 'Calming Tools', path: '/child/tools', color: 'bg-secondary/20 hover:bg-secondary/30 text-secondary' },
    { icon: BookOpen, label: 'All My Entries', path: '/child/entries', color: 'bg-warm/30 hover:bg-warm/40 text-foreground' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 relative">
      <FloatingElements theme={currentTheme} />
      <div className="max-w-2xl mx-auto space-y-6 pb-24 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center space-y-4">
            <AvatarDisplay avatarData={avatarData} size="lg" className="mx-auto" />
            <div>
              <h1 className="text-3xl font-bold">Hello, {nickname || 'Friend'}! 👋</h1>
              <Card className="p-4 bg-gradient-to-br from-accent/30 to-warm/30 border-0 mt-3">
                <p className="text-lg font-medium">{affirmation}</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${item.color}`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <Icon className="h-10 w-10" />
                  <span className="font-bold">{item.label}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Logout */}
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full"
        >
          Log Out
        </Button>
      </div>

      <INeedHelpButton />
    </div>
  );
}