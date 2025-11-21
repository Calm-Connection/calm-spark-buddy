import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Info, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { PatternInsightsCard } from '@/components/carer/PatternInsightsCard';
import { ConversationStartersCard } from '@/components/carer/ConversationStartersCard';
import { TimelineView } from '@/components/carer/TimelineView';
import { ResourceLibrary } from '@/components/carer/ResourceLibrary';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { CarerActionGuidance } from '@/components/carer/CarerActionGuidance';
import { SafeguardingPrinciples } from '@/components/carer/SafeguardingPrinciples';

interface SafeguardingLog {
  id: string;
  journal_entry_id: string;
  child_id: string;
  detected_keywords: string[];
  severity_score: number;
  action_taken: string;
  created_at: string;
  escalation_tier: number;
  historical_context: any;
  protective_factors_present: any;
  journal_entry?: {
    entry_text: string;
    mood_tag: string;
    created_at: string;
  };
  wendy_insight?: {
    summary: string;
    parent_summary: string;
    themes: string[];
    mood_score: number;
  };
}

export default function SafeguardingDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState<SafeguardingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [childNickname, setChildNickname] = useState('');

  useEffect(() => {
    loadSafeguardingData();
  }, [user]);

  const loadSafeguardingData = async () => {
    if (!user) return;

    try {
      // Get linked child
      const { data: childProfile } = await supabase
        .from('children_profiles')
        .select('id, nickname')
        .eq('linked_carer_id', user.id)
        .maybeSingle();

      if (!childProfile) {
        setLoading(false);
        return;
      }

      setChildNickname(childProfile.nickname);

      // Get safeguarding logs with related data
      const { data: logsData, error } = await supabase
        .from('safeguarding_logs')
        .select(`
          *,
          journal_entry:journal_entries!safeguarding_logs_journal_entry_id_fkey(
            entry_text,
            mood_tag,
            created_at
          )
        `)
        .eq('child_id', childProfile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get Wendy insights for each log
      const logsWithInsights = await Promise.all(
        (logsData || []).map(async (log) => {
          const { data: insight } = await supabase
            .from('wendy_insights')
            .select('summary, parent_summary, themes, mood_score')
            .eq('journal_entry_id', log.journal_entry_id)
            .maybeSingle();

          return {
            ...log,
            wendy_insight: insight,
          };
        })
      );

      setLogs(logsWithInsights as SafeguardingLog[]);
    } catch (error) {
      console.error('Error loading safeguarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Compute pattern insights from logs
  const getPatternInsights = () => {
    if (logs.length === 0) return null;

    // Extract recurring themes
    const themeCount: Record<string, number> = {};
    logs.forEach(log => {
      (log.wendy_insight?.themes || []).forEach(theme => {
        themeCount[theme] = (themeCount[theme] || 0) + 1;
      });
    });
    const recurringThemes = Object.entries(themeCount)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);

    // Calculate mood trajectory
    const recentMoods = logs.slice(0, 5).map(l => l.wendy_insight?.mood_score || 5);
    const olderMoods = logs.slice(5, 10).map(l => l.wendy_insight?.mood_score || 5);
    const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    const olderAvg = olderMoods.length > 0 
      ? olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length 
      : recentAvg;
    
    let moodTrajectory: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg > olderAvg + 1) moodTrajectory = 'improving';
    if (recentAvg < olderAvg - 1) moodTrajectory = 'declining';

    // Tool effectiveness (placeholder - would need tool_usage data)
    const toolUsageCorrelation = [
      { tool: 'Breathing Space', effectiveness: 0.8 },
      { tool: 'Gentle Reflections', effectiveness: 0.7 },
      { tool: 'Colour Calm', effectiveness: 0.6 }
    ];

    // Extract protective factors
    const protectiveFactors: string[] = [];
    logs.forEach(log => {
      if (log.protective_factors_present) {
        const factors = Array.isArray(log.protective_factors_present) 
          ? log.protective_factors_present 
          : [];
        factors.forEach((f: any) => {
          if (typeof f === 'string' && !protectiveFactors.includes(f)) {
            protectiveFactors.push(f);
          }
        });
      }
    });

    return {
      recurringThemes,
      moodTrajectory,
      toolUsageCorrelation,
      protectiveFactors: protectiveFactors.slice(0, 4)
    };
  };

  // Generate conversation starters based on themes and tiers
  const getConversationStarters = () => {
    if (logs.length === 0) return [];

    const recentLog = logs[0];
    const themes = recentLog.wendy_insight?.themes || [];
    const tier = recentLog.escalation_tier || 1;

    const starters: string[] = [];

    // Theme-based starters
    if (themes.includes('school') || themes.includes('academic')) {
      starters.push("I've noticed you've been doing a lot of thinking lately. How are things going at school?");
    }
    if (themes.includes('friends') || themes.includes('social')) {
      starters.push("Sometimes friendships can be tricky. Would you like to tell me about what's been happening with your friends?");
    }
    if (themes.includes('anxiety') || themes.includes('worry')) {
      starters.push("It's okay to feel worried sometimes. Would it help to talk about what's on your mind?");
    }
    if (themes.includes('lonely') || themes.includes('isolation')) {
      starters.push("I'm here for you, and I'd love to spend some time together. What would you like to do?");
    }

    // Tier-based starters
    if (tier >= 3) {
      starters.push("I've been thinking about you a lot. I'm here to listen if you want to talk about anything - big or small.");
      starters.push("You don't have to face tough feelings alone. I'm always here for you, no matter what.");
    } else {
      starters.push("I'm proud of how you're managing things. Is there anything you'd like to share or talk about?");
    }

    // Always include a general one
    starters.push("Sometimes it helps to talk. I'm here whenever you're ready - no pressure.");

    return starters.slice(0, 4);
  };

  // Prepare timeline entries
  const getTimelineEntries = () => {
    return logs.map(log => ({
      id: log.id,
      date: log.created_at,
      tier: log.escalation_tier || 1,
      summary: log.wendy_insight?.parent_summary || log.wendy_insight?.summary || 'Entry recorded',
      themes: log.wendy_insight?.themes || [],
      moodScore: log.wendy_insight?.mood_score || 5,
      protectiveFactors: Array.isArray(log.protective_factors_present) 
        ? log.protective_factors_present.slice(0, 3)
        : []
    }));
  };

  // Extract active themes for resource filtering
  const getActiveThemes = () => {
    const themes = new Set<string>();
    logs.slice(0, 5).forEach(log => {
      (log.wendy_insight?.themes || []).forEach(theme => themes.add(theme));
    });
    return Array.from(themes);
  };

  const patternInsights = getPatternInsights();
  const conversationStarters = getConversationStarters();
  const timelineEntries = getTimelineEntries();
  const activeThemes = getActiveThemes();
  
  // Calculate current and highest escalation tier
  const currentTier = logs.length > 0 ? (logs[0].escalation_tier || 1) : 0;
  const highestTier = logs.length > 0 
    ? Math.max(...logs.map(l => l.escalation_tier || 1))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-40 w-full" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-60 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              Wellbeing Insights
            </h1>
            <p className="text-muted-foreground">
              {childNickname ? `Supporting ${childNickname}'s emotional journey` : 'Supporting your child\'s wellbeing'}
            </p>
          </div>
        </div>

        {/* Emergency Resources */}
        <Alert className="border-primary/30 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-semibold">If you need immediate support:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="tel:999">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency: 999
                </a>
              </Button>
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="tel:0800-1111">
                  <Phone className="h-4 w-4 mr-2" />
                  Childline: 0800 1111
                </a>
              </Button>
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="tel:116-123">
                  <Phone className="h-4 w-4 mr-2" />
                  Samaritans: 116 123
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {logs.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
            <h3 className="text-2xl font-bold mb-2">All Good Here 💚</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no wellbeing insights to display. The system is gently monitoring {childNickname}'s emotional journey.
            </p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Carer Action Guidance */}
              <CarerActionGuidance 
                currentTier={currentTier}
                highestTier={highestTier}
              />

              {/* Pattern Insights */}
              {patternInsights && (
                <PatternInsightsCard
                  recurringThemes={patternInsights.recurringThemes}
                  moodTrajectory={patternInsights.moodTrajectory}
                  toolUsageCorrelation={patternInsights.toolUsageCorrelation}
                  protectiveFactors={patternInsights.protectiveFactors}
                />
              )}

              {/* Conversation Starters */}
              {conversationStarters.length > 0 && (
                <ConversationStartersCard
                  starters={conversationStarters}
                  themes={activeThemes}
                />
              )}

              {/* Timeline View */}
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                  <TabsTrigger value="summary">Summary View</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-6">
                  <TimelineView entries={timelineEntries} />
                </TabsContent>

                <TabsContent value="summary" className="mt-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Entries</div>
                        <div className="text-2xl font-bold">{logs.length}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Needs Attention</div>
                        <div className="text-2xl font-bold text-accent">
                          {logs.filter(l => (l.escalation_tier || 0) >= 3).length}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Positive Entries</div>
                        <div className="text-2xl font-bold text-interactive-accent">
                          {logs.filter(l => (l.wendy_insight?.mood_score || 0) >= 7).length}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Safeguarding Principles */}
              <SafeguardingPrinciples />
              
              {/* Resource Library */}
              <ResourceLibrary activeThemes={activeThemes} />
            </div>
          </div>
        )}
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
