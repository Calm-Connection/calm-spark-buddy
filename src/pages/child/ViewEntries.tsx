import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { BookOpen, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { MoodIcon } from '@/components/MoodIcon';
import { getEmotionalIcon } from '@/constants/emotionalIcons';
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

export default function ViewEntries() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
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
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deleted',
      description: 'Entry has been deleted',
    });
    
    setEntries(entries.filter(e => e.id !== entryToDelete));
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/10 to-background px-4 sm:px-6 py-6 pb-24 relative">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.08} />
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-interactive-accent/10 transition-colors">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            My Journal Entries 📖
          </h1>
          <p className="text-muted-foreground font-medium">
            All your thoughts and feelings in one place
          </p>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center shadow-soft-lg border-interactive-accent/20">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-interactive-accent" />
            <p className="text-muted-foreground mb-4 font-medium">
              You haven't written any entries yet
            </p>
            <Button onClick={() => navigate('/child/journal-entry')} className="hover:scale-[1.02] transition-all duration-200">
              Write Your First Entry
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200 border-interactive-accent/20">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2 items-center">
                    {entry.mood_tag && (
                      <>
                        <MoodIcon moodId={entry.mood_tag} size="sm" />
                        <Badge variant="secondary" className="capitalize">
                          {getEmotionalIcon(entry.mood_tag)?.label || entry.mood_tag}
                        </Badge>
                      </>
                    )}
                    {entry.share_with_carer && (
                      <Badge variant="outline">Shared with carer</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </span>
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
                <p className="text-sm whitespace-pre-wrap line-clamp-3">{entry.entry_text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <INeedHelpButton />
    </div>
  );
}