import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { WendyAvatar } from '@/components/WendyAvatar';
import { Brain, TrendingUp, Heart, ArrowLeft, Lightbulb, AlertTriangle, Info, ChevronDown, ChevronUp, CheckCircle2, ExternalLink, Smile, Frown, MessageCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { format } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TechniqueGuideModal } from '@/components/TechniqueGuideModal';
import { Checkbox } from '@/components/ui/checkbox';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { MoodIcon } from '@/components/MoodIcon';
import { SkeletonCard } from '@/components/SkeletonCard';
import { PageTransition } from '@/components/PageTransition';

interface Insight {
  id: string;
  summary: string;
  parent_summary?: string;
  mood_score: number;
  themes: string[];
  recommended_tools: string[];
  recommended_tool_ids?: string[];
  carer_actions?: string[];
  escalate: boolean;
  created_at: string;
}

interface CopingTool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function CarerInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [childNickname, setChildNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTechniqueGuide, setShowTechniqueGuide] = useState(false);
  const [toolDetails, setToolDetails] = useState<Record<string, CopingTool>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadInsights();
  }, [user]);

  const loadInsights = async () => {
    if (!user) return;

    // Get linked child
    const { data: linkedChild } = await supabase
      .from('children_profiles')
      .select('id, nickname')
      .eq('linked_carer_id', user.id)
      .maybeSingle();

    if (linkedChild) {
      setChildNickname(linkedChild.nickname);

      // Get insights
      const { data: insightsData } = await supabase
        .from('wendy_insights')
        .select('*')
        .eq('child_id', linkedChild.id)
        .order('created_at', { ascending: false })
        .limit(20);

      setInsights((insightsData as Insight[]) || []);

      // Load tool details for all recommended tools
      const allToolIds = new Set<string>();
      insightsData?.forEach((insight: any) => {
        insight.recommended_tool_ids?.forEach((id: string) => allToolIds.add(id));
      });

      if (allToolIds.size > 0) {
        const { data: tools } = await supabase
          .from('coping_tools')
          .select('id, name, description, icon')
          .in('id', Array.from(allToolIds));

        if (tools) {
          const toolsMap: Record<string, CopingTool> = {};
          tools.forEach((tool) => {
            toolsMap[tool.id] = tool;
          });
          setToolDetails(toolsMap);
        }
      }
    }

    setLoading(false);
  };

  const getMoodIconId = (score: number) => {
    if (score >= 80) return 'happy';
    if (score >= 60) return 'calm';
    if (score >= 40) return 'okay';
    if (score >= 20) return 'sad';
    return 'worried';
  };

  const getMoodLabel = (score: number) => {
    if (score >= 80) return 'Very Positive';
    if (score >= 60) return 'Positive';
    if (score >= 40) return 'Neutral';
    if (score >= 20) return 'Low';
    return 'Needs Support';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4 sm:p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Emotional Insights 🧠</h1>
              <p className="text-muted-foreground">Loading insights...</p>
            </div>
          </div>
          
          {/* Skeleton loading cards */}
          <div className="space-y-4">
            <SkeletonCard variant="insight" className="animate-fade-up animate-stagger-1" />
            <SkeletonCard variant="insight" className="animate-fade-up animate-stagger-2" />
            <SkeletonCard variant="insight" className="animate-fade-up animate-stagger-3" />
          </div>
        </div>
        <BottomNav role="carer" />
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4 sm:p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Emotional Insights 🧠</h1>
            <p className="text-muted-foreground">
              {childNickname ? `AI summaries for ${childNickname}` : 'Gentle summaries from Wendy'}
            </p>
          </div>
        </div>

        {!childNickname ? (
          <Card className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No children linked to your account yet
            </p>
            <Button onClick={() => navigate('/carer/invite-code')}>
              Generate Invite Code
            </Button>
          </Card>
        ) : insights.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              No insights yet
            </p>
            <p className="text-sm text-muted-foreground">
              Wendy will analyze journal entries as {childNickname} writes them 💛
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Explanatory Header */}
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">Understanding Emotional Insights</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                These AI-generated insights help you understand {childNickname}'s emotional patterns and offer practical ways to support them. 
                They're designed to guide your conversations and actions - small steps make a big difference 🌱
              </p>
              
              <div className="bg-background/50 rounded-lg p-4 space-y-2 mb-4">
                <p className="text-sm font-semibold">What you'll find here:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Mood scores showing emotional wellbeing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Themes detected in journal entries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Specific actions you can take</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Suggested calming activities to try together</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTechniqueGuide(true)}
                className="w-full text-xs sm:text-sm"
              >
                <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate sm:whitespace-normal">Learn More About Support Techniques</span>
              </Button>
            </Card>

            {/* Understanding Mood Scores Guide */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Understanding Mood Scores</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-2 rounded bg-secondary/10">
                  <MoodIcon moodId="happy" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">80-100: Very Positive</p>
                    <p className="text-xs text-muted-foreground">Thriving emotionally, expressing joy and contentment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-primary/10">
                  <MoodIcon moodId="calm" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">60-79: Positive</p>
                    <p className="text-xs text-muted-foreground">Coping well with some challenges, generally upbeat</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-accent/10">
                  <MoodIcon moodId="okay" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">40-59: Neutral</p>
                    <p className="text-xs text-muted-foreground">Mixed feelings, could benefit from extra support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-warm/10">
                  <MoodIcon moodId="sad" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">20-39: Low</p>
                    <p className="text-xs text-muted-foreground">Struggling emotionally, needs active support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-destructive/10">
                  <MoodIcon moodId="worried" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">0-19: Needs Support</p>
                    <p className="text-xs text-muted-foreground">Experiencing significant distress, requires immediate care</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Insights List */}
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                childNickname={childNickname}
                toolDetails={toolDetails}
                getMoodIconId={getMoodIconId}
                getMoodLabel={getMoodLabel}
              />
            ))}
            {/* When to Seek Additional Support */}
            <Card className="p-6 bg-gradient-to-br from-warm/10 to-accent/10 border-warm/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-warm" />
                <h3 className="font-bold">When to Seek Additional Support</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                If you notice any of the following, consider speaking to your child's school, GP, or a mental health professional:
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warm mt-0.5" />
                  <span className="text-muted-foreground">Persistent low mood lasting more than 2 weeks</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warm mt-0.5" />
                  <span className="text-muted-foreground">Withdrawal from activities they usually enjoy</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warm mt-0.5" />
                  <span className="text-muted-foreground">Significant changes in sleep or eating patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warm mt-0.5" />
                  <span className="text-muted-foreground">Mentions of self-harm or feeling unsafe</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warm mt-0.5" />
                  <span className="text-muted-foreground">Severe anxiety that interferes with daily life</span>
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Helpful Resources:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <span>Childline: 0800 1111 (free, confidential support for children)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <span>YoungMinds Parent Helpline: 0808 802 5544</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <span>NHS 111 for urgent mental health support</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mt-4">
                Remember: Seeking help is a sign of strength, not weakness. You're taking the right steps to support your child's wellbeing.
              </p>
            </Card>
          </div>
        )}
      </div>

      <TechniqueGuideModal open={showTechniqueGuide} onOpenChange={setShowTechniqueGuide} />
      <BottomNav role="carer" />
    </div>
    </PageTransition>
  );
}

// Separate component for individual insight cards
interface InsightCardProps {
  insight: Insight;
  childNickname: string;
  toolDetails: Record<string, CopingTool>;
  getMoodIconId: (score: number) => string;
  getMoodLabel: (score: number) => string;
}

function InsightCard({ insight, childNickname, toolDetails, getMoodIconId, getMoodLabel }: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <WendyAvatar size="md" className="mx-auto sm:mx-0" />
        <div className="flex-1 space-y-2 sm:space-y-3 w-full">
          {/* Mood Score with Explanation */}
          <div className="flex flex-wrap items-center gap-2">
            <MoodIcon moodId={getMoodIconId(insight.mood_score)} size="sm" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge variant="secondary" className="text-xs cursor-help flex items-center gap-1">
                  {getMoodLabel(insight.mood_score)} ({insight.mood_score}/100)
                  <Info className="h-3 w-3" />
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Understanding this score</p>
                  <p className="text-xs text-muted-foreground">
                    This score (0-100) reflects {childNickname}'s emotional wellbeing based on their journal entry. 
                    Lower scores suggest they may need extra support, while higher scores indicate positive emotional patterns.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
            {insight.escalate && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Needs attention
              </Badge>
            )}
            <span className="text-xs text-muted-foreground w-full sm:w-auto sm:ml-auto">
              {format(new Date(insight.created_at), 'PPP')}
            </span>
          </div>

          {/* Summary */}
          <p className="text-sm leading-relaxed">{insight.parent_summary || insight.summary}</p>

          {/* Themes */}
          {insight.themes && insight.themes.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2">Themes detected:</p>
              <div className="flex gap-2 flex-wrap">
                {insight.themes.map((theme, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs capitalize">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* What You Can Do - Carer Actions Checklist */}
          {insight.carer_actions && insight.carer_actions.length > 0 && (
            <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">What You Can Do</h4>
              </div>
              <div className="space-y-3">
                {insight.carer_actions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <Checkbox
                      id={`action-${insight.id}-${idx}`}
                      checked={checkedActions[idx]}
                      onCheckedChange={(checked) => 
                        setCheckedActions(prev => ({ ...prev, [idx]: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor={`action-${insight.id}-${idx}`}
                      className={`text-sm leading-relaxed cursor-pointer transition-opacity ${
                        checkedActions[idx] ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      {action}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Activities with Details */}
          {insight.recommended_tool_ids && insight.recommended_tool_ids.length > 0 && (
            <div className="p-4 bg-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Suggested Activities for {childNickname}</p>
              </div>
              <div className="space-y-2">
                {insight.recommended_tool_ids.map((toolId) => {
                  const tool = toolDetails[toolId];
                  if (!tool) return null;
                  return (
                    <div key={toolId} className="bg-background/60 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{tool.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{tool.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expandable Details Section */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show More Details
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {/* What Wendy Said to Child */}
              <div className="p-3 sm:p-4 bg-muted/30 rounded-lg">
                <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                  <Heart className="h-3 w-3" />
                  What Wendy Told {childNickname}:
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{insight.summary}"
                </p>
              </div>
              
              {/* Parent-Focused Interpretation */}
              <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                  <Heart className="h-3 w-3 text-primary" />
                  For You (The Carer):
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.parent_summary || "Based on this entry, your child may benefit from gentle support and reassurance. Consider creating a calm moment to connect."}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Encouragement Message */}
          <p className="text-xs text-muted-foreground italic mt-2">
            💜 Remember: You're doing an amazing job. Your support and presence make all the difference.
          </p>
        </div>
      </div>
    </Card>
  );
}
