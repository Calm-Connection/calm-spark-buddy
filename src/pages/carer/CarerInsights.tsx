import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { WendyAvatar } from '@/components/WendyAvatar';
import { Brain, TrendingUp, Heart, ArrowLeft, Lightbulb, AlertTriangle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { format } from 'date-fns';

interface Insight {
  id: string;
  summary: string;
  parent_summary?: string;
  mood_score: number;
  themes: string[];
  recommended_tools: string[];
  escalate: boolean;
  created_at: string;
}

export default function CarerInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [childNickname, setChildNickname] = useState('');
  const [loading, setLoading] = useState(true);
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
    }

    setLoading(false);
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '😌';
    if (score >= 40) return '😐';
    if (score >= 20) return '😔';
    return '😢';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
        <p className="text-muted-foreground">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
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
            {/* Summary Card */}
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="font-bold">How to use insights</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                These AI-generated insights help you understand {childNickname}'s emotional patterns and offer practical ways to support them. 
                They're designed to guide your conversations and actions. Small steps make a big difference 🌱
              </p>
            </Card>

            {/* Insights List */}
            {insights.map((insight) => (
              <Card key={insight.id} className="p-6">
                <div className="flex items-start gap-4">
                  <WendyAvatar size="lg" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl">{getMoodEmoji(insight.mood_score)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getMoodLabel(insight.mood_score)} ({insight.mood_score}/100)
                      </Badge>
                      {insight.escalate && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs attention
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {format(new Date(insight.created_at), 'PPP')}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed">{insight.parent_summary || insight.summary}</p>

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

                    {insight.recommended_tools && insight.recommended_tools.length > 0 && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <p className="text-xs font-semibold">Suggested activities:</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {insight.recommended_tools.join(', ')}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground italic mt-2">
                      💜 Remember: You're doing an amazing job. Your support and presence make all the difference.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
