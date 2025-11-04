import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, BookOpen, Wrench, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAchievementProgress } from '@/hooks/useAchievementProgress';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { applyTheme, type ThemeName } from '@/hooks/useTheme';
import { FloatingElements } from '@/components/FloatingElements';
import { BottomNav } from '@/components/BottomNav';
import { NotificationBell } from '@/components/NotificationBell';
import { WendyTipCard } from '@/components/WendyTipCard';
import { toast } from 'sonner';

const affirmations = [
  "You are brave and strong 💪",
  "Your feelings matter 💜",
  "You are doing great today ⭐",
  "It's okay to ask for help 🤗",
  "You make the world brighter ☀️",
];

export default function ChildHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('classic');
  const [affirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [wendyTip, setWendyTip] = useState<string | null>(null);
  const [childProfileId, setChildProfileId] = useState<string | undefined>();
  const [showPostJournalTip, setShowPostJournalTip] = useState(false);
  const [postJournalAction, setPostJournalAction] = useState<{ type: string; link: string; label: string } | null>(null);

  // Track achievement progress automatically
  useAchievementProgress(childProfileId);

  // Check for post-journal tips from navigation state
  useEffect(() => {
    if (location.state?.showWendyTip) {
      const { moodScore, entryText } = location.state;
      generatePostJournalTip(moodScore, entryText);
      setShowPostJournalTip(true);
      
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const generatePostJournalTip = (moodScore: number, entryText: string) => {
    if (moodScore < 40) {
      setWendyTip("I'm proud of you for sharing how you're feeling. Remember, it's okay to not feel okay. Would you like to try something calming?");
      setPostJournalAction({ type: 'tool', link: '/child/tools', label: 'Try a Calming Tool' });
    } else if (moodScore < 60) {
      setWendyTip("Thanks for checking in with your feelings. Taking a short break might help you feel even better!");
      setPostJournalAction({ type: 'suggestion', link: '/child/tools', label: 'Explore Calming Activities' });
    } else {
      setWendyTip("You're doing great! Keep up this positive energy. Maybe try learning something new to keep that good feeling going.");
      setPostJournalAction({ type: 'module', link: '/child/modules', label: 'Learn Something New' });
    }
  };

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
        .select('id, nickname, avatar_json, theme, gender')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setNickname(data.nickname);
        setAvatarData(data.avatar_json);
        setChildProfileId(data.id);
        
        // Apply saved theme
        if (data.theme) {
          applyTheme(data.theme as ThemeName);
          setCurrentTheme(data.theme as ThemeName);
        }

        // Check if checked in today
        await checkTodayCheckIn(data.id);
        
        // Load achievements preview
        await loadAchievementsPreview();
        
        // Load Wendy's tip
        await loadWendyTip(data.id);
        
        // Prompt for avatar if missing
        if (!data.avatar_json) {
          setTimeout(() => {
            toast.info('Create Your Avatar! 🎨 - Make your profile unique by creating an avatar.', {
              duration: 10000,
            });
          }, 2000);
        }
      }
    };

    loadProfile();
  }, [user, navigate]);

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

  const loadWendyTip = async (childId: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { data } = await supabase
      .from('wendy_insights')
      .select('summary')
      .eq('child_id', childId)
      .gte('created_at', `${yesterdayStr}T00:00:00`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.summary) {
      setWendyTip(data.summary);
    }
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
          <div className="flex justify-end gap-2">
            <NotificationBell />
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

        {/* Post-Journal Wendy's Tip */}
        {showPostJournalTip && wendyTip && postJournalAction && (
          <WendyTipCard 
            tip={wendyTip}
            actionType={postJournalAction.type as any}
            actionLink={postJournalAction.link}
            actionLabel={postJournalAction.label}
          />
        )}

        {/* Regular Wendy's Tip */}
        {!showPostJournalTip && wendyTip && (
          <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Wendy's Tip for You 💜</h3>
                <p className="text-sm">{wendyTip}</p>
              </div>
            </div>
          </Card>
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

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-accent/20 to-warm/20"
            onClick={() => navigate('/child/tools')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Tools</h3>
                <p className="text-xs text-muted-foreground">Calming activities</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-secondary/20 to-accent/20"
            onClick={() => navigate('/child/modules')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold">Learn</h3>
                <p className="text-xs text-muted-foreground">Helpful modules</p>
              </div>
            </div>
          </Card>
        </div>

        {/* All Entries Link */}
        <Card
          className="p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-primary/10 to-secondary/10"
          onClick={() => navigate('/child/entries')}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">All My Entries</h3>
              <p className="text-sm text-muted-foreground">View all journal entries, drawings & recordings</p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}