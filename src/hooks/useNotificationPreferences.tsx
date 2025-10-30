import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface NotificationPreferences {
  id?: string;
  user_id: string;
  role: 'child' | 'carer';
  
  // Child settings
  journal_reminders: boolean;
  journal_reminder_time: string;
  mood_checkins: boolean;
  mood_checkin_frequency: string;
  calm_activities: boolean;
  encouragement_messages: boolean;
  connection_prompts: boolean;
  
  // Carer settings
  insights_summary: boolean;
  insights_frequency: string;
  shared_reflections: boolean;
  support_tools: boolean;
  wellbeing_content: boolean;
  safeguarding_alerts: boolean;
  
  // Universal settings
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  notification_sound: boolean;
  notification_vibration: boolean;
}

export function useNotificationPreferences(role: 'child' | 'carer') {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user, role]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', role)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences(data as NotificationPreferences);
      } else {
        // Create default preferences
        const defaultPrefs = {
          user_id: user.id,
          role: role as 'child' | 'carer',
          journal_reminders: true,
          journal_reminder_time: '18:00',
          mood_checkins: true,
          mood_checkin_frequency: 'daily',
          calm_activities: true,
          encouragement_messages: true,
          connection_prompts: true,
          insights_summary: true,
          insights_frequency: 'weekly',
          shared_reflections: true,
          support_tools: true,
          wellbeing_content: true,
          safeguarding_alerts: true,
          quiet_hours_enabled: true,
          quiet_hours_start: '21:00',
          quiet_hours_end: '08:00',
          notification_sound: true,
          notification_vibration: true,
        };

        const { data: newPrefs, error: insertError } = await supabase
          .from('notification_preferences')
          .insert([defaultPrefs as any])
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newPrefs as NotificationPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Could not load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;

    try {
      // Remove id and user_id from updates to avoid conflicts
      const { id, user_id, ...updateData } = updates as any;
      
      const { error } = await supabase
        .from('notification_preferences')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('role', role);

      if (error) throw error;

      setPreferences({ ...preferences, ...updates } as NotificationPreferences);
      toast.success('Settings saved');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Could not save settings');
    }
  };

  return { preferences, loading, updatePreferences };
}
