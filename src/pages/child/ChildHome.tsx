import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, BookOpen, Wrench, GraduationCap, Sparkles, Smile, Meh, Frown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAchievementProgress } from '@/hooks/useAchievementProgress';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { applyTheme, type ThemeName } from '@/hooks/useTheme';
import { FloatingElements } from '@/components/FloatingElements';
import { BottomNav } from '@/components/BottomNav';
import { NotificationBell } from '@/components/NotificationBell';
import { WendyTipCard } from '@/components/WendyTipCard';
import { SectionTitle } from '@/components/SectionTitle';
import { toast } from 'sonner';
import { getEmotionalIconsByCategory } from '@/constants/emotionalIcons';
import { MoodIcon } from '@/components/MoodIcon';

// 30+ warm, gentle affirmations following Calm Connection brand voice
const affirmations = [
  "You are brave and strong 💪",
  "Your feelings matter 💜",
  "You are doing great today ⭐",
  "It's okay to ask for help 🤗",
  "You make the world brighter ☀️",
  "You are loved just as you are 💕",
  "Every feeling is okay to have 🌈",
  "You're doing your best, and that's enough ✨",
  "Your heart is full of kindness 💛",
  "It's okay to take things slowly 🐢",
  "You bring joy to people around you 🌻",
  "Being you is your superpower 🦸",
  "You are safe and supported here 🏠",
  "Small steps still count 👣",
  "You are capable of amazing things 🌟",
  "It's okay to feel however you feel 🫂",
  "You deserve kindness, especially from yourself 💗",
  "Your thoughts and ideas are valuable 💭",
  "Every day is a fresh start 🌅",
  "You have the strength to get through this 💪",
  "It's brave to share how you feel 🗣️",
  "You are never alone in your feelings 👐",
  "Taking a break is always okay 🧘",
  "Your smile can light up a room 😊",
  "Mistakes help us learn and grow 🌱",
  "You are worthy of good things 🎁",
  "It's okay to ask for a hug 🤗",
  "You matter more than you know 💫",
  "Being gentle with yourself is important 🌸",
  "You have so much to be proud of 🏆",
  "Every breath you take is a tiny victory 🌬️",
];

// Get consistent daily quote based on date
const getDailyAffirmation = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return affirmations[dayOfYear % affirmations.length];
};

export default function ChildHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('classic');
  const [affirmation] = useState(() => getDailyAffirmation());
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [wendyTip, setWendyTip] = useState<string | null>(null);
  const [childProfileId, setChildProfileId] = useState<string | undefined>();
  const [showPostJournalTip, setShowPostJournalTip] = useState(false);
  const [postJournalAction, setPostJournalAction] = useState<{ type: string; link: string; label: string } | null>(null);
  const [lastTipDate, setLastTipDate] = useState<string | null>(null);

  // Track achievement progress automatically (pass both userId and childProfileId)
  useAchievementProgress(user?.id, childProfileId);

  // Check for daily tip reset and post-journal tips
  useEffect(() => {
    // Check if we need to reset tip for new day
    const today = new Date().toISOString().split('T')[0];
    const storedTipDate = localStorage.getItem('wendyTipDate');
    
    if (storedTipDate && storedTipDate !== today) {
      // New day - clear tip
      setWendyTip(null);
      setShowPostJournalTip(false);
      localStorage.removeItem('wendyTipDate');
    } else if (storedTipDate) {
      setLastTipDate(storedTipDate);
    }
    
    // Check for post-journal tips from navigation state
    if (location.state?.showWendyTip) {
      const { moodScore, entryText } = location.state;
      generatePostJournalTip(moodScore, entryText);
      setShowPostJournalTip(true);
      localStorage.setItem('wendyTipDate', today);
      
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const generatePostJournalTip = (moodScore: number, entryText: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (moodScore < 40) {
      setWendyTip("I'm really proud of you for sharing how you're feeling. It takes courage! Remember, difficult feelings don't last forever. Would a calming activity help right now?");
      setPostJournalAction({ type: 'tool', link: '/child/tools', label: 'Try a Calming Tool' });
    } else if (moodScore < 60) {
      setWendyTip("Thanks for checking in with your feelings today. You're doing a great job taking care of yourself. A gentle activity might help you feel even better!");
      setPostJournalAction({ type: 'tool', link: '/child/tools', label: 'Explore Calming Activities' });
    } else {
      setWendyTip("Your positive energy is wonderful! Keep noticing the good things around you. Want to learn something new to keep that great feeling going?");
      setPostJournalAction({ type: 'module', link: '/child/modules', label: 'Learn Something New' });
    }
    
    localStorage.setItem('wendyTipDate', today);
  };

  const presetMoods = {
    positive: getEmotionalIconsByCategory('positive'),
    neutral: getEmotionalIconsByCategory('neutral'),
    challenging: getEmotionalIconsByCategory('challenging'),
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      // Prevent re-fetching if avatar already loaded in session
      if (avatarData && nickname && childProfileId) return;

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
        
        // Check for recent escalations and dismissals
        await checkRecentEscalations(data.id);
        await checkHelplineDismissals(data.id);
        
        // Prompt for avatar if missing
        if (!data.avatar_json) {
          setTimeout(() => {
            toast.info('Create your character! 🎨 Make your profile feel like you.', {
              duration: 10000,
            });
          }, 2000);
        }
      }
    };

    loadProfile();
  }, [user, navigate]);

  const checkRecentEscalations = async (profileId: string) => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    try {
      const { data } = await supabase
        .from('safeguarding_logs')
        .select('*, wendy_insight:wendy_insights(*)')
        .eq('child_id', profileId)
        .gte('escalation_tier', 3)
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        setWendyTip("How are you feeling today? Did you get a chance to talk to someone? 💜");
      }
    } catch (error) {
      console.error('Error checking escalations:', error);
    }
  };

  const checkHelplineDismissals = async (profileId: string) => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    try {
      const { data } = await supabase
        .from('helpline_engagements')
        .select('*')
        .eq('child_id', profileId)
        .eq('engagement_type', 'dismissed')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        setWendyTip("Remember, you can always talk to someone you trust. Your feelings matter 💜");
      }
    } catch (error) {
      console.error('Error checking dismissals:', error);
    }
  };

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
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

    const { data } = await supabase
      .from('wendy_insights')
      .select('summary')
      .eq('child_id', childId)
      .gte('created_at', `${threeDaysAgoStr}T00:00:00`)
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background px-4 sm:px-6 py-6 pb-24 relative">
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
              <Card className="p-4 bg-gradient-to-br from-accent/30 to-warm/30 border border-border/40 backdrop-blur-sm mt-3">
                <p className="text-lg font-medium">{affirmation}</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        {achievements.length > 0 && (
          <div className="flex items-center justify-center gap-4 px-2">
            {achievements.map((achievement) => {
              const isEarned = userAchievements.some(ua => ua.achievement_id === achievement.id);
              return (
                <button
                  key={achievement.id}
                  onClick={() => navigate('/child/achievements')}
                  className={`text-4xl p-2 rounded-xl transition-all hover:scale-110 ${!isEarned ? 'grayscale opacity-40' : 'animate-pulse-soft'}`}
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
          <WendyTipCard 
            tip={wendyTip}
            actionType="suggestion"
            actionLink="/child/tools"
            actionLabel="Explore Tools"
          />
        )}

        {/* Daily Check-in */}
        {!hasCheckedInToday && (
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <SectionTitle>How are you feeling today?</SectionTitle>
            
            <Tabs defaultValue="positive" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="positive" className="text-sm flex items-center gap-1">
                  <Smile className="h-4 w-4" />
                  Positive
                </TabsTrigger>
                <TabsTrigger value="neutral" className="text-sm flex items-center gap-1">
                  <Meh className="h-4 w-4" />
                  Neutral
                </TabsTrigger>
                <TabsTrigger value="challenging" className="text-sm flex items-center gap-1">
                  <Frown className="h-4 w-4" />
                  Challenging
                </TabsTrigger>
              </TabsList>

              <TabsContent value="positive" className="mt-0 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetMoods.positive.map((mood) => (
                    <Button
                      key={mood.id}
                      variant="outline"
                      onClick={() => handleMoodSelect(mood.id)}
                      className="h-auto flex flex-col items-center gap-2 p-3 hover:scale-105 transition-transform min-w-0"
                    >
                      <MoodIcon moodId={mood.id} size="sm" />
                      <span className="text-xs text-foreground truncate w-full text-center">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="neutral" className="mt-0 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetMoods.neutral.map((mood) => (
                    <Button
                      key={mood.id}
                      variant="outline"
                      onClick={() => handleMoodSelect(mood.id)}
                      className="h-auto flex flex-col items-center gap-2 p-3 hover:scale-105 transition-transform min-w-0"
                    >
                      <MoodIcon moodId={mood.id} size="sm" />
                      <span className="text-xs text-foreground truncate w-full text-center">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenging" className="mt-0 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetMoods.challenging.map((mood) => (
                    <Button
                      key={mood.id}
                      variant="outline"
                      onClick={() => handleMoodSelect(mood.id)}
                      className="h-auto flex flex-col items-center gap-2 p-3 hover:scale-105 transition-transform min-w-0"
                    >
                      <MoodIcon moodId={mood.id} size="sm" />
                      <span className="text-xs text-foreground truncate w-full text-center">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

          </Card>
        )}

        {/* Quick Access Cards */}
        <div>
          
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 sm:p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-accent/20 to-warm/20"
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
              className="p-4 sm:p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-secondary/20 to-accent/20"
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
        </div>

        {/* All Entries Link */}
        <Card
          className="p-4 sm:p-5 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-primary/10 to-secondary/10"
          onClick={() => navigate('/child/entries')}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg">All My Entries</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">View all journal entries, drawings & recordings</p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}