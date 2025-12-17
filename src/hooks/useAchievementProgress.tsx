import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationTrigger } from './useNotificationTrigger';
import { useToast } from './use-toast';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  requirement_count: number;
  category: string;
}

/**
 * Hook to track achievement progress and trigger notifications when earned
 */
export function useAchievementProgress(userId: string | undefined) {
  const { notifyAchievementEarned } = useNotificationTrigger();
  const { toast } = useToast();

  const showAchievementUnlock = useCallback((name: string, icon: string) => {
    toast({
      title: `${icon} Achievement Unlocked!`,
      description: name,
      duration: 5000,
    });
  }, [toast]);

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
        .select('id, mood_tag, share_with_carer, created_at', { count: 'exact' })
        .eq('child_id', userId);

      // Check module completion for relevant achievements
      const { data: moduleProgress, count: moduleCount } = await supabase
        .from('user_module_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('completed', true);

      // Check tool usage for relevant achievements
      const { data: toolUsage, count: toolCount } = await supabase
        .from('tool_usage')
        .select('id, tool_name', { count: 'exact' })
        .eq('user_id', userId);

      // Count shared entries
      const sharedCount = journalEntries?.filter(e => e.share_with_carer)?.length || 0;
      
      // Count unique mood types used
      const uniqueMoods = new Set(journalEntries?.map(e => e.mood_tag).filter(Boolean) || []);
      const moodVarietyCount = uniqueMoods.size;

      // Count breathing tool uses
      const breathingCount = toolUsage?.filter(t => 
        t.tool_name?.toLowerCase().includes('breathing') || 
        t.tool_name?.toLowerCase().includes('breath')
      )?.length || 0;

      // Count calm corner uses
      const calmCornerCount = toolUsage?.filter(t => 
        t.tool_name?.toLowerCase().includes('calm')
      )?.length || 0;

      // Calculate streak
      let streakCount = 0;
      if (journalEntries && journalEntries.length > 0) {
        const sortedEntries = [...journalEntries].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        let lastDate: Date | null = null;
        for (const entry of sortedEntries) {
          const entryDate = new Date(entry.created_at);
          entryDate.setHours(0, 0, 0, 0);
          
          if (!lastDate) {
            streakCount = 1;
            lastDate = entryDate;
          } else {
            const dayDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff === 1) {
              streakCount++;
              lastDate = entryDate;
            } else if (dayDiff > 1) {
              break;
            }
          }
        }
      }

      for (const achievement of achievements) {
        if (earnedIds.has(achievement.id)) continue;

        let currentProgress = 0;

        // Determine progress based on achievement category
        switch (achievement.category) {
          case 'journal':
            currentProgress = journalCount || 0;
            break;
          case 'module':
            currentProgress = moduleCount || 0;
            break;
          case 'checkin':
            currentProgress = journalCount || 0;
            break;
          case 'streak':
            currentProgress = streakCount;
            break;
          case 'sharing':
            currentProgress = sharedCount;
            break;
          case 'tool_usage':
            currentProgress = toolCount || 0;
            break;
          case 'breathing':
            currentProgress = breathingCount;
            break;
          case 'calm_corner':
            currentProgress = calmCornerCount;
            break;
          case 'emotion_variety':
            currentProgress = moodVarietyCount;
            break;
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

          // Trigger notification and show toast
          await notifyAchievementEarned(userId, achievement.name, achievement.icon);
          showAchievementUnlock(achievement.name, achievement.icon);
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

    const toolChannel = supabase
      .channel('achievement-tool-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tool_usage',
        },
        () => checkAndUpdateAchievements()
      )
      .subscribe();

    // Subscribe to user_achievements for instant UI feedback
    const achievementChannel = supabase
      .channel('achievement-earned-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Fetch achievement details for the toast
          const { data: achievement } = await supabase
            .from('achievements')
            .select('name, icon, requirement_count')
            .eq('id', payload.new.achievement_id)
            .single();
          
          if (achievement && payload.new.progress >= achievement.requirement_count) {
            showAchievementUnlock(achievement.name, achievement.icon);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(journalChannel);
      supabase.removeChannel(moduleChannel);
      supabase.removeChannel(toolChannel);
      supabase.removeChannel(achievementChannel);
    };
  }, [userId, notifyAchievementEarned, showAchievementUnlock]);
}
