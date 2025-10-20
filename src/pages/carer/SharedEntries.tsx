import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SharedEntry {
  id: string;
  entry_text: string;
  mood_tag: string | null;
  created_at: string;
  child_id: string;
  children_profiles: {
    nickname: string;
  };
}

export default function SharedEntries() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<SharedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedEntries = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select(`
          id,
          entry_text,
          mood_tag,
          created_at,
          child_id,
          children_profiles (
            nickname
          )
        `)
        .eq('share_with_carer', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading shared entries:', error);
      } else {
        setEntries(data as SharedEntry[]);
      }
      setLoading(false);
    };

    loadSharedEntries();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Shared Entries 💜</h1>
            <p className="text-muted-foreground mt-1">Entries your child shared with you</p>
          </div>
        </div>

        {loading ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">Loading entries...</p>
          </Card>
        ) : entries.length === 0 ? (
          <Card className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No shared entries yet. Your child can choose to share entries with you from their journal.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(entry.mood_tag)}</span>
                    <div>
                      <p className="font-semibold">{entry.children_profiles?.nickname || 'Your child'}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), 'PPP')}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{entry.entry_text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
