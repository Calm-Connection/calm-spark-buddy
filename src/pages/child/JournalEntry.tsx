import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { HelplineModal } from '@/components/HelplineModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const moods = ['happy', 'sad', 'angry', 'worried', 'calm', 'excited', 'scared'];

export default function JournalEntry() {
  const [entryText, setEntryText] = useState('');
  const [mood, setMood] = useState<string>('');
  const [shareWithCarer, setShareWithCarer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [childProfile, setChildProfile] = useState<any>(null);
  const [showSafeguardingModal, setShowSafeguardingModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      // Get or create child profile
      let { data: profile } = await supabase
        .from('children_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        // Create profile from localStorage data
        const nickname = localStorage.getItem('pendingNickname') || 'Friend';
        const theme = localStorage.getItem('selectedTheme');
        const avatarData = localStorage.getItem('avatarData');
        const linkedCarerId = localStorage.getItem('linkedCarerId');

        const { data: newProfile } = await supabase
          .from('children_profiles')
          .insert({
            user_id: user.id,
            nickname,
            theme,
            avatar_json: avatarData ? JSON.parse(avatarData) : null,
            linked_carer_id: linkedCarerId || null,
          })
          .select()
          .single();

        profile = newProfile;

        // Clean up localStorage
        localStorage.removeItem('pendingNickname');
        localStorage.removeItem('selectedTheme');
        localStorage.removeItem('avatarData');
        localStorage.removeItem('linkedCarerId');
      }

      setChildProfile(profile);
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!entryText.trim() || !childProfile) return;

    setLoading(true);

    try {
      // Save journal entry
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          child_id: childProfile.id,
          entry_text: entryText,
          mood_tag: mood || null,
          share_with_carer: shareWithCarer,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Analyze with Wendy AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'wendy-analyze-journal',
        {
          body: {
            entryText,
            childId: childProfile.id,
            journalEntryId: entry.id,
          },
        }
      );

      if (analysisError) {
        console.error('Wendy analysis error:', analysisError);
      }

      // Check if safeguarding was triggered
      if (analysisData?.escalate) {
        setShowSafeguardingModal(true);
        setLoading(false);
        return;
      }

      toast({
        title: 'Saved! 💜',
        description: 'Your journal entry has been saved',
      });

      navigate('/child/home');
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save entry. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2">Write in Your Journal</h1>
          <p className="text-muted-foreground">
            Share what's on your mind. It's your safe space.
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>How are you feeling today?</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a mood (optional)" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Your thoughts...</Label>
            <Textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Write anything you want to share. It's okay if it's messy or doesn't make perfect sense."
              className="min-h-[300px] text-base"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {entryText.length}/2000
            </p>
          </div>

          {childProfile?.linked_carer_id && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="share"
                checked={shareWithCarer}
                onCheckedChange={(checked) => setShareWithCarer(checked as boolean)}
              />
              <label htmlFor="share" className="text-sm leading-tight">
                Share this entry with my carer (they won't see it unless you tick this)
              </label>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={loading || !entryText.trim()}
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      <INeedHelpButton />
      <HelplineModal open={showSafeguardingModal} onOpenChange={setShowSafeguardingModal} />
    </div>
  );
}