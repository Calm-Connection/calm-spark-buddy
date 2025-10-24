import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';

interface JournalEntry {
  id: string;
  entry_text: string;
  created_at: string;
}

export default function CarerJournal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [carerId, setCarerId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('carer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      setCarerId(profile.id);
      loadEntries(profile.id);
    }
  };

  const loadEntries = async (id: string) => {
    const { data } = await supabase
      .from('carer_journal_entries')
      .select('id, entry_text, created_at')
      .eq('carer_id', id)
      .order('created_at', { ascending: false });

    if (data) {
      setEntries(data);
    }
  };

  const handleSave = async () => {
    if (!newEntry.trim() || !carerId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('carer_journal_entries')
        .insert({
          carer_id: carerId,
          entry_text: newEntry,
          entry_type: 'text',
        });

      if (error) throw error;

      toast.success('Journal entry saved!');
      setNewEntry('');
      loadEntries(carerId);
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Could not save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Private Journal</h1>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">New Entry</h2>
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <Textarea
            placeholder="Write your thoughts and feelings here..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="min-h-[150px] resize-none"
          />
          <Button onClick={handleSave} disabled={loading || !newEntry.trim()} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Entry
          </Button>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Previous Entries</h2>
          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No journal entries yet. Start writing!</p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(entry.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="whitespace-pre-wrap">{entry.entry_text}</p>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
