import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Brain, TrendingUp, Heart } from 'lucide-react';

export default function Insights() {
  const [insights, setInsights] = useState<any[]>([]);
  const [linkedChildren, setLinkedChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      // Get linked children
      const { data: children } = await supabase
        .from('children_profiles')
        .select('*')
        .eq('linked_carer_id', user.id);

      setLinkedChildren(children || []);

      if (children && children.length > 0) {
        // Get insights for linked children
        const childIds = children.map((c) => c.id);
        const { data: insightsData } = await supabase
          .from('wendy_insights')
          .select('*')
          .in('child_id', childIds)
          .order('created_at', { ascending: false })
          .limit(10);

        setInsights(insightsData || []);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2">Weekly Insights</h1>
          <p className="text-muted-foreground">
            Gentle summaries from Wendy about your child's emotional journey
          </p>
        </div>

        {linkedChildren.length === 0 ? (
          <Card className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No children linked to your account yet
            </p>
            <Button onClick={() => navigate('/carer/invite-code')} className="bg-primary hover:bg-primary/90">
              Generate Invite Code
            </Button>
          </Card>
        ) : insights.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No insights yet. Wendy will analyze journal entries as your child writes them.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Mood: {insight.mood_score}/100
                      </Badge>
                      {insight.escalate && (
                        <Badge variant="destructive">Needs attention</Badge>
                      )}
                    </div>
                    <p className="text-sm">{insight.summary}</p>
                    {insight.themes && insight.themes.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {insight.themes.map((theme: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="capitalize">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {insight.recommended_tools && insight.recommended_tools.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        Suggested: {insight.recommended_tools.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}