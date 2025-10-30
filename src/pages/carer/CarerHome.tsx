import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, Heart, Brain, Sparkles, BookOpen, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { applyTheme } from '@/hooks/useTheme';
import { BottomNav } from '@/components/BottomNav';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { NotificationBell } from '@/components/NotificationBell';

interface MoodData {
  date: string;
  mood_score: number;
}

interface LatestInsight {
  summary: string;
  mood_score: number;
  themes: string[];
  created_at: string;
}

export default function CarerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [childNickname, setChildNickname] = useState('');
  const [linkedChildId, setLinkedChildId] = useState<string>('');
  const [journalCount, setJournalCount] = useState(0);
  const [moodTrend, setMoodTrend] = useState<MoodData[]>([]);
  const [latestInsight, setLatestInsight] = useState<LatestInsight | null>(null);
  const [suggestedAction, setSuggestedAction] = useState('');
  const [hasNewSharedEntry, setHasNewSharedEntry] = useState(false);

  useEffect(() => {
    loadCarerData();
  }, [user]);

  const loadCarerData = async () => {
    if (!user) return;

    // Get carer profile
    const { data: carerProfile } = await supabase
      .from('carer_profiles')
      .select('id, nickname, avatar_json')
      .eq('user_id', user.id)
      .maybeSingle();

    if (carerProfile) {
      setNickname(carerProfile.nickname || 'Carer');
      setAvatarData(carerProfile.avatar_json);
    }

    // Get linked child
    const { data: linkedChild } = await supabase
      .from('children_profiles')
      .select('id, nickname')
      .eq('linked_carer_id', user.id)
      .maybeSingle();

    if (linkedChild) {
      setLinkedChildId(linkedChild.id);
      setChildNickname(linkedChild.nickname);
      await loadChildData(linkedChild.id);
    }

    applyTheme('classic');
  };

  const loadChildData = async (childId: string) => {
    // Count shared entries
    const { count } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId)
      .eq('share_with_carer', true);

    setJournalCount(count || 0);

    // Get mood trend (last 7 days from insights)
    const sevenDaysAgo = subDays(new Date(), 7);
    const { data: insights } = await supabase
      .from('wendy_insights')
      .select('created_at, mood_score')
      .eq('child_id', childId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (insights) {
      const trendData = insights.map((i) => ({
        date: format(new Date(i.created_at), 'MMM dd'),
        mood_score: i.mood_score || 50,
      }));
      setMoodTrend(trendData);
    }

    // Get latest AI insight
    const { data: latestInsightData } = await supabase
      .from('wendy_insights')
      .select('summary, mood_score, themes, created_at')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestInsightData) {
      setLatestInsight(latestInsightData as LatestInsight);
      
      // Generate suggested action based on mood score
      const moodScore = latestInsightData.mood_score || 50;
      if (moodScore < 40) {
        setSuggestedAction('Try a calming activity together 🌿');
      } else if (moodScore < 60) {
        setSuggestedAction('Schedule some quality time together 💜');
      } else {
        setSuggestedAction('Keep up the great support! 🌟');
      }
    }

    // Check for new shared entries (within last 24 hours)
    const yesterday = subDays(new Date(), 1);
    const { count: recentCount } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId)
      .eq('share_with_carer', true)
      .gte('created_at', yesterday.toISOString());

    setHasNewSharedEntry((recentCount || 0) > 0);
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '😌';
    if (score >= 40) return '😐';
    if (score >= 20) return '😔';
    return '😢';
  };

  const getMoodColor = (score: number) => {
    if (score >= 80) return 'from-secondary/20 to-primary/10';
    if (score >= 60) return 'from-primary/20 to-accent/10';
    if (score >= 40) return 'from-warm/20 to-accent/10';
    return 'from-dusty-rose/20 to-accent/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex w-full justify-between items-start">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <AvatarDisplay avatarData={avatarData} size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome back, {nickname} 🌿</h1>
            <p className="text-muted-foreground mt-1">
              {childNickname ? `Supporting ${childNickname}'s wellbeing` : 'Supporting your child\'s emotional journey'}
            </p>
          </div>
        </div>

        {!linkedChildId ? (
          <Card className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Connect with Your Child</h2>
            <p className="text-muted-foreground mb-4">
              Generate an invite code to link with your child's account
            </p>
            <Button onClick={() => navigate('/carer/invite-code')}>
              Generate Invite Code
            </Button>
          </Card>
        ) : (
          <>
            {/* Notifications Panel */}
            {hasNewSharedEntry && (
              <Card className="p-4 bg-gradient-to-r from-secondary/20 to-primary/20 border-primary/30">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">New shared reflection</p>
                    <p className="text-xs text-muted-foreground">
                      {childNickname} shared a journal entry with you
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/carer/shared-entries')}>
                    View
                  </Button>
                </div>
              </Card>
            )}

            {/* Wellbeing Overview - Latest Insight */}
            {latestInsight && (
              <Card className={`p-6 bg-gradient-to-br ${getMoodColor(latestInsight.mood_score)}`}>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Wellbeing Overview</h3>
                      <span className="text-2xl">{getMoodEmoji(latestInsight.mood_score)}</span>
                    </div>
                    <p className="text-sm">{latestInsight.summary}</p>
                    {latestInsight.themes && latestInsight.themes.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {latestInsight.themes.slice(0, 3).map((theme, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(latestInsight.created_at), 'PPp')}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* This Week with Wendy */}
            {latestInsight && moodTrend.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">This Week with Wendy 🌿</h3>
                  </div>

                  {/* Weekly Insight */}
                  <div className="bg-background/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground italic">
                      "{latestInsight.summary.slice(0, 150)}{latestInsight.summary.length > 150 ? '...' : ''}"
                    </p>
                  </div>

                  {/* Progress Tracker */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{journalCount}</p>
                      <p className="text-xs text-muted-foreground">Journals</p>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">
                        {moodTrend.filter(m => m.mood_score >= 60).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Calm Days</p>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <p className="text-2xl font-bold text-accent">
                        {Math.round(moodTrend.reduce((sum, m) => sum + m.mood_score, 0) / moodTrend.length)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Mood</p>
                    </div>
                  </div>

                  {/* Mini 7-Day Mood Trend */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">7-Day Mood Snapshot</p>
                    <div className="flex items-end gap-1 h-16">
                      {moodTrend.map((data, idx) => {
                        const height = (data.mood_score / 100) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-muted rounded-t relative" style={{ height: '100%' }}>
                              <div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-secondary rounded-t transition-all"
                                style={{ height: `${height}%` }}
                                title={`${data.date}: ${data.mood_score}%`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">7d ago</span>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Mood Tracker */}
            {moodTrend.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Emotional Trend (Last 7 Days)</h3>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {moodTrend.map((data, idx) => {
                    const height = (data.mood_score / 100) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: '100%' }}>
                          <div
                            className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.date.split(' ')[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Suggested Action */}
            {suggestedAction && (
              <Card className="p-5 bg-gradient-to-br from-accent/20 to-warm/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Suggested Action</p>
                    <p className="text-sm text-muted-foreground">{suggestedAction}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{journalCount}</p>
                    <p className="text-xs text-muted-foreground">Shared Entries</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-secondary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-xs text-muted-foreground">Connection</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => navigate('/carer/insights')}
              >
                <Brain className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">View Detailed Insights</p>
                  <p className="text-xs text-muted-foreground">AI summaries and trends</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => navigate('/carer/resources')}
              >
                <Sparkles className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Parenting Resources</p>
                  <p className="text-xs text-muted-foreground">Modules and guidance for carers</p>
                </div>
              </Button>
            </div>
          </>
        )}
      </div>

      <BottomNav role="carer" />
    </div>
  );
}