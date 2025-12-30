import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { toast } from 'sonner';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { JournalIntroModal } from '@/components/JournalIntroModal';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { PageTransition } from '@/components/PageTransition';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

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

  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryToDelete);

    if (error) {
      toast.error('Failed to delete entry');
      return;
    }

    toast.success('Entry deleted');
    setEntries(entries.filter(e => e.id !== entryToDelete));
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    okay: '😐',
    sad: '😢',
    angry: '😠',
    worried: '😰',
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/10 to-background pb-24 relative">
      <DecorativeIcon icon="leaf" position="top-right" opacity={0.08} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/home')} className="h-10 w-10 hover:bg-interactive-accent/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            My Journal 📝
          </h1>
        </div>

        <Button onClick={() => navigate('/child/journal-entry')} className="w-full hover:scale-[1.02] transition-all duration-200">
          Write New Entry
        </Button>

        {/* Short journal disclaimer */}
        <DisclaimerCard variant="journal-short" size="small" />

        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-8 text-center shadow-soft-lg border-interactive-accent/20">
              <p className="text-muted-foreground font-medium">No journal entries yet. Start writing!</p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200 border-interactive-accent/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{moodEmojis[entry.mood_tag] || '😊'}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.share_with_carer && (
                      <span className="text-xs bg-accent/30 px-2 py-1 rounded">Shared</span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-3">{entry.entry_text}</p>
              </Card>
            ))
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this journal entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Journal intro modal - shows on first visit */}
      <JournalIntroModal />

      <BottomNav role="child" />
    </div>
    </PageTransition>
  );
}
