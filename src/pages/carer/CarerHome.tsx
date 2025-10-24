import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { applyTheme } from '@/hooks/useTheme';
import { BottomNav } from '@/components/BottomNav';

export default function CarerHome() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState('Carer');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [childMood, setChildMood] = useState<{
    mood: string;
    text: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data: carerProfile } = await supabase
        .from('carer_profiles')
        .select('id, nickname, avatar_json')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (carerProfile) {
        if (carerProfile.nickname) setNickname(carerProfile.nickname);
        if (carerProfile.avatar_json) setAvatarData(carerProfile.avatar_json);

        // Load linked child's latest mood
        await loadChildMood(carerProfile.id);
      }
      
      // Carers always use Classic theme
      applyTheme('classic');
    };

    fetchProfile();
  }, [user]);

  const loadChildMood = async (carerId: string) => {
    // Find linked child
    const { data: linkedChild } = await supabase
      .from('children_profiles')
      .select('id, nickname')
      .eq('linked_carer_id', user?.id)
      .maybeSingle();

    if (!linkedChild) return;

    // Get their latest shared journal entry
    const { data: latestEntry } = await supabase
      .from('journal_entries')
      .select('mood_tag, entry_text, created_at')
      .eq('child_id', linkedChild.id)
      .eq('share_with_carer', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestEntry) {
      setChildMood({
        mood: latestEntry.mood_tag || 'okay',
        text: latestEntry.entry_text,
        date: latestEntry.created_at,
      });
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex w-full justify-between items-start">
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <AvatarDisplay avatarData={avatarData} size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome, {nickname}! 💜</h1>
            <p className="text-muted-foreground mt-1">Supporting your child's emotional journey</p>
          </div>
        </div>

        {/* Child's Mood Note */}
        {childMood && (
          <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/10 border-primary/20">
            <h2 className="text-xl font-bold mb-3">Child's Latest Mood</h2>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{moodEmojis[childMood.mood]}</span>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(childMood.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="line-clamp-3">{childMood.text}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <BottomNav role="carer" />
    </div>
  );
}