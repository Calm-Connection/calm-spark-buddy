import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationTrigger } from './useNotificationTrigger';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  requirement_count: number;
}

/**
 * Hook to track achievement progress and trigger notifications when earned
 */
export function useAchievementProgress(userId: string | undefined) {
  const { notifyAchievementEarned } = useNotificationTrigger();

  useEffect(() => {
    if (!userId) return;

    const checkAndUpdateAchievements = async () => {
      // Get all achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*');

      if (!achievements) return;

      // Get user's current progress
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      const earnedIds = new Set(
        userAchievements?.filter(ua => ua.progress >= (achievements.find(a => a.id === ua.achievement_id)?.requirement_count || 1)).map(ua => ua.achievement_id) || []
      );

      // Check journal entry count for relevant achievements
      const { data: journalEntries, count: journalCount } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact' })
        .eq('child_id', userId);

      // Check module completion for relevant achievements
      const { data: moduleProgress, count: moduleCount } = await supabase
        .from('user_module_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('completed', true);

      for (const achievement of achievements) {
        if (earnedIds.has(achievement.id)) continue;

        let currentProgress = 0;

        // Determine progress based on achievement category
        if (achievement.category === 'journaling') {
          currentProgress = journalCount || 0;
        } else if (achievement.category === 'learning') {
          currentProgress = moduleCount || 0;
        } else if (achievement.category === 'mood') {
          // Get consecutive days with mood check-ins
          const { data: recentEntries } = await supabase
            .from('journal_entries')
            .select('created_at')
            .eq('child_id', userId)
            .not('mood_tag', 'is', null)
            .order('created_at', { ascending: false })
            .limit(30);

          if (recentEntries) {
            let streak = 0;
            let lastDate: Date | null = null;
            for (const entry of recentEntries) {
              const entryDate = new Date(entry.created_at);
              entryDate.setHours(0, 0, 0, 0);
              
              if (!lastDate) {
                streak = 1;
                lastDate = entryDate;
              } else {
                const dayDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                  streak++;
                  lastDate = entryDate;
                } else {
                  break;
                }
              }
            }
            currentProgress = streak;
          }
        }

        // Update or create user achievement record
        const existingAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);

        if (currentProgress >= achievement.requirement_count) {
          // Achievement earned!
          if (existingAchievement) {
            await supabase
              .from('user_achievements')
              .update({ progress: currentProgress })
              .eq('id', existingAchievement.id);
          } else {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: userId,
                achievement_id: achievement.id,
                progress: currentProgress,
              });
          }

          // Trigger notification
          await notifyAchievementEarned(userId, achievement.name, achievement.icon);
        } else if (existingAchievement && existingAchievement.progress < currentProgress) {
          // Update progress
          await supabase
            .from('user_achievements')
            .update({ progress: currentProgress })
            .eq('id', existingAchievement.id);
        } else if (!existingAchievement && currentProgress > 0) {
          // Create initial progress record
          await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              progress: currentProgress,
            });
        }
      }
    };

    checkAndUpdateAchievements();

    // Subscribe to changes that might affect achievements
    const journalChannel = supabase
      .channel('achievement-journal-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'journal_entries',
        },
        () => checkAndUpdateAchievements()
      )
      .subscribe();

    const moduleChannel = supabase
      .channel('achievement-module-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_module_progress',
        },
        () => checkAndUpdateAchievements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(journalChannel);
      supabase.removeChannel(moduleChannel);
    };
  }, [userId, notifyAchievementEarned]);
}
