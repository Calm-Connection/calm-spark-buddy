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
import { Wind, Heart, Music, Palette, Sparkles, GraduationCap } from 'lucide-react';

const affirmations = [
  "You are brave and strong 💪",
  "Your feelings matter 💜",
  "You are doing great today ⭐",
  "It's okay to ask for help 🤗",
  "You make the world brighter ☀️",
];

const tools = [
  {
    icon: Wind,
    title: 'Breathing Exercise',
    description: 'Calm your mind with gentle breathing',
    path: null,
  },
  {
    icon: Heart,
    title: 'Guided Meditation',
    description: 'Short, peaceful meditation for you',
    path: null,
  },
  {
    icon: Music,
    title: 'Calming Sounds',
    description: 'Soothing music and nature sounds',
    path: null,
  },
  {
    icon: Palette,
    title: 'Drawing Space',
    description: 'Express yourself through art',
    path: null,
  },
  {
    icon: Sparkles,
    title: 'Talk to Wendy',
    description: 'Chat with your AI friend',
    path: '/child/wendy-chat',
  },
];

export default function ChildHome() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('classic');
  const [affirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);

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
        
        // Load achievements preview
        await loadAchievementsPreview();
      }
    };

    loadProfile();
  }, [user]);

  const loadAchievementsPreview = async () => {
    // Load top 4 achievements
    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('*')
      .limit(4);

    if (achievementsData) {
      setAchievements(achievementsData);
    }

    // Load user's earned achievements
    const { data: userAchievementsData } = await supabase
      .from('user_achievements')
      .select('achievement_id');

    if (userAchievementsData) {
      setUserAchievements(userAchievementsData);
    }
  };

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

        {/* Achievements Preview */}
        {achievements.length > 0 && (
          <div className="flex items-center justify-center gap-3 px-2">
            {achievements.map((achievement) => {
              const isEarned = userAchievements.some(ua => ua.achievement_id === achievement.id);
              return (
                <button
                  key={achievement.id}
                  onClick={() => navigate('/child/achievements')}
                  className={`text-4xl transition-all hover:scale-110 ${!isEarned ? 'grayscale opacity-40' : ''}`}
                  title={achievement.name}
                >
                  {achievement.icon}
                </button>
              );
            })}
          </div>
        )}

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

        {/* Calming Tools */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold px-2">Calming Tools 🧘</h2>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.title}
                className="p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-accent/20 to-warm/20"
                onClick={() => tool.path && navigate(tool.path)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                {!tool.path && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">Coming soon</p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Learning Modules */}
        <Card
          className="p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-secondary/20 to-accent/20"
          onClick={() => navigate('/child/modules')}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Learning Modules</h3>
              <p className="text-sm text-muted-foreground">Learn about anxiety and coping</p>
            </div>
          </div>
        </Card>
      </div>

      <INeedHelpButton />
      <BottomNav role="child" />
    </div>
  );
}