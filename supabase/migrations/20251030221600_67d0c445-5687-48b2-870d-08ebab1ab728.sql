-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  
  -- Child notification settings
  journal_reminders boolean DEFAULT true,
  journal_reminder_time text DEFAULT '18:00',
  mood_checkins boolean DEFAULT true,
  mood_checkin_frequency text DEFAULT 'daily',
  calm_activities boolean DEFAULT true,
  encouragement_messages boolean DEFAULT true,
  connection_prompts boolean DEFAULT true,
  
  -- Carer notification settings
  insights_summary boolean DEFAULT true,
  insights_frequency text DEFAULT 'weekly',
  shared_reflections boolean DEFAULT true,
  support_tools boolean DEFAULT true,
  wellbeing_content boolean DEFAULT true,
  safeguarding_alerts boolean DEFAULT true,
  
  -- Universal settings
  quiet_hours_enabled boolean DEFAULT true,
  quiet_hours_start text DEFAULT '21:00',
  quiet_hours_end text DEFAULT '08:00',
  notification_sound boolean DEFAULT true,
  notification_vibration boolean DEFAULT true,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view own notification preferences"
ON public.notification_preferences
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "Users can insert own notification preferences"
ON public.notification_preferences
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update own notification preferences"
ON public.notification_preferences
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create notification history table for tracking
CREATE TABLE public.notification_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  notification_content text NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  dismissed_at timestamp with time zone,
  
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own notification history
CREATE POLICY "Users can view own notification history"
ON public.notification_history
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update their own notification history (mark as read/dismissed)
CREATE POLICY "Users can update own notification history"
ON public.notification_history
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();