import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { applyTheme, type ThemeName } from '@/hooks/useTheme';
import { FloatingElements } from '@/components/FloatingElements';
import { BottomNav } from '@/components/BottomNav';
import { ChildAchievements } from './ChildAchievements';

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
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'okay', label: 'Okay', emoji: '😐' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'worried', label: 'Worried', emoji: '😰' },
    { id: 'angry', label: 'Angry', emoji: '😠' },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('children_profiles')
        .select('id, nickname, avatar_json, theme')
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

        // Check if checked in today
        await checkTodayCheckIn(data.id);
      }
    };

    loadProfile();
  }, [user]);

  const checkTodayCheckIn = async (childId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('journal_entries')
      .select('id')
      .eq('child_id', childId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .maybeSingle();

    setHasCheckedInToday(!!data);
  };

  const handleMoodSelect = async (moodId: string) => {
    navigate('/child/journal-entry', { state: { selectedMood: moodId, quickCheckIn: true } });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 pb-24 relative">
      <FloatingElements theme={currentTheme} />
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
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

        {/* Daily Check-in */}
        {!hasCheckedInToday && (
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <h2 className="text-xl font-bold mb-3">How are you feeling today?</h2>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-background/80 hover:bg-background transition-all hover:scale-105"
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Achievements Preview */}
        <ChildAchievements />
      </div>

      <INeedHelpButton />
      <BottomNav role="child" />
    </div>
  );
}