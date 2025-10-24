import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Loader2 } from 'lucide-react';

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
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Achievements</h2>
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
  );
}
