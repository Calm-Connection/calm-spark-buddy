import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';

interface JournalEntry {
  id: string;
  entry_text: string;
  mood_tag: string;
  created_at: string;
  share_with_carer: boolean;
}

export default function ChildJournal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('children_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) return;

    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('child_id', profile.id)
      .order('created_at', { ascending: false });

    if (data) {
      setEntries(data);
    }
  };

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    okay: '😐',
    sad: '😢',
    angry: '😠',
    worried: '😰',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Journal</h1>
        </div>

        <Button onClick={() => navigate('/child/journal-entry')} className="w-full">
          Write New Entry
        </Button>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No journal entries yet. Start writing!</p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{moodEmojis[entry.mood_tag] || '😊'}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.share_with_carer && (
                    <span className="text-xs bg-accent/30 px-2 py-1 rounded">Shared</span>
                  )}
                </div>
                <p className="line-clamp-3">{entry.entry_text}</p>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
