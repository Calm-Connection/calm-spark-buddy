import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react';

export default function ViewEntries() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('children_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('child_id', profile.id)
        .order('created_at', { ascending: false });

      setEntries(data || []);
      setLoading(false);
    };

    loadEntries();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2">My Journal Entries</h1>
          <p className="text-muted-foreground">
            All your thoughts and feelings in one place
          </p>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              You haven't written any entries yet
            </p>
            <Button onClick={() => navigate('/child/journal-entry')} className="bg-secondary hover:bg-secondary/90">
              Write Your First Entry
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    {entry.mood_tag && (
                      <Badge variant="secondary" className="capitalize">
                        {entry.mood_tag}
                      </Badge>
                    )}
                    {entry.share_with_carer && (
                      <Badge variant="outline">Shared with carer</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(entry.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap line-clamp-3">{entry.entry_text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <INeedHelpButton />
    </div>
  );
}