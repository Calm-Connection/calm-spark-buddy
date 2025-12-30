import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Brain, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

interface SharedEntryWithInsight {
  id: string;
  entry_text: string;
  mood_tag: string | null;
  created_at: string;
  child_id: string;
  children_profiles: {
    nickname: string;
  };
  insight?: {
    summary: string;
    mood_score: number;
  };
}

export default function SharedEntries() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<SharedEntryWithInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedEntries();
  }, [user]);

  const loadSharedEntries = async () => {
    if (!user) return;

    // Get linked child
    const { data: linkedChild } = await supabase
      .from('children_profiles')
      .select('id, nickname')
      .eq('linked_carer_id', user.id)
      .maybeSingle();

    if (!linkedChild) {
      setLoading(false);
      return;
    }

    // Get shared journal entries
    const { data: entriesData, error } = await supabase
      .from('journal_entries')
      .select(`
        id,
        entry_text,
        mood_tag,
        created_at,
        child_id
      `)
      .eq('child_id', linkedChild.id)
      .eq('share_with_carer', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading shared entries:', error);
      setLoading(false);
      return;
    }

    // Get AI insights for each entry
    const entriesWithInsights = await Promise.all(
      (entriesData || []).map(async (entry) => {
        const { data: insightData } = await supabase
          .from('wendy_insights')
          .select('summary, mood_score')
          .eq('journal_entry_id', entry.id)
          .maybeSingle();

        return {
          ...entry,
          children_profiles: { nickname: linkedChild.nickname },
          insight: insightData || undefined,
        };
      })
    );

    setEntries(entriesWithInsights);
    setLoading(false);
  };

  const getMoodEmoji = (mood: string | null) => {
    const moodMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      worried: '😰',
      excited: '🤩',
      calm: '😌',
      scared: '😨',
    };
    return mood ? moodMap[mood] || '😊' : '📝';
  };

  const getMoodLabel = (mood: string | null) => {
    const moodLabels: Record<string, string> = {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      worried: 'Worried',
      excited: 'Excited',
      calm: 'Calm',
      scared: 'Scared',
    };
    return mood ? moodLabels[mood] || 'Neutral' : 'Neutral';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background px-4 sm:px-6 py-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Shared Reflections 💬</h1>
            <p className="text-muted-foreground mt-1">Entries your child chose to share</p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="p-5 bg-gradient-to-br from-secondary/20 to-primary/10 border-primary/30">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Privacy & Trust</p>
              <p className="text-xs text-muted-foreground">
                These are entries your child chose to share with you. Private entries remain completely 
                confidential. AI summaries help you understand without reading every detail.
              </p>
            </div>
          </div>
        </Card>

        {loading ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">Loading entries...</p>
          </Card>
        ) : entries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              No shared entries yet
            </p>
            <p className="text-sm text-muted-foreground">
              Your child can choose to share journal entries with you from their journal page 💜
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getMoodEmoji(entry.mood_tag)}</span>
                      <div>
                        <p className="font-semibold">{entry.children_profiles?.nickname}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(entry.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getMoodLabel(entry.mood_tag)}
                    </Badge>
                  </div>

                  {/* AI Summary (if available) */}
                  {entry.insight && (
                    <div className="p-4 bg-accent/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold">Wendy's Summary</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {entry.insight.summary}
                      </p>
                    </div>
                  )}

                  {/* Entry Text */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Shared reflection:</p>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {entry.entry_text}
                    </p>
                  </div>

                  {/* Gentle Reminder */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      💛 This is a good moment to check in with {entry.children_profiles?.nickname}. 
                      Small conversations make a big difference.
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
