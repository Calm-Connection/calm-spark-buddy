import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_count: number;
}

interface UserAchievement {
  achievement_id: string;
  earned_at: string;
  progress: number;
}

export function ChildAchievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;

    try {
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('category', { ascending: true });

      const { data: earned } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (allAchievements) setAchievements(allAchievements);
      if (earned) setUserAchievements(earned);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
        <BottomNav role="child" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Your Achievements</h1>
        </div>

        <div className="grid gap-3">
          {achievements.map((achievement) => {
            const userAch = userAchievements.find((ua) => ua.achievement_id === achievement.id);
            const earned = userAch && userAch.progress >= achievement.requirement_count;

            return (
              <AchievementBadge
                key={achievement.id}
                icon={achievement.icon}
                name={achievement.name}
                description={achievement.description}
                earned={!!earned}
                progress={userAch?.progress || 0}
                requirementCount={achievement.requirement_count}
              />
            );
          })}
        </div>
      </div>
      
      <BottomNav role="child" />
    </div>
  );
}
