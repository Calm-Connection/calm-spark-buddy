import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationContent {
  type: string;
  title: string;
  body: string;
  category: string;
}

// Notification messages by type
const notificationMessages = {
  child: {
    journal_reminder: [
      { title: "Your journal is waiting 💙", body: "Would you like to write about your day? Even a few words can help you feel lighter." },
      { title: "Time to reflect", body: "Your calm space is here if you'd like to share what's on your mind." },
      { title: "Check in with yourself", body: "No pressure, but your journal is ready when you are." },
    ],
    mood_checkin: [
      { title: "How's your heart? 💛", body: "Let's check in — what emoji matches your mood right now?" },
      { title: "Feeling check", body: "How are you feeling today? Want to share with me?" },
      { title: "Mood moment", body: "Take a breath and notice — how does your body feel right now?" },
    ],
    calm_activity: [
      { title: "Mini calm break 🌸", body: "Let's take a 2-minute breathing exercise together?" },
      { title: "Pause & breathe", body: "Would you like to try a quick grounding activity?" },
      { title: "Calm moment", body: "Ready for a gentle stretch or breathing break?" },
    ],
    encouragement: [
      { title: "You're doing great 🌟", body: "Noticing your feelings takes real courage. Keep going." },
      { title: "Beautiful progress", body: "Every time you check in with yourself, you're building strength." },
      { title: "Proud of you", body: "Writing about your feelings isn't easy — you're being so brave." },
    ],
    connection_prompt: [
      { title: "Share your thoughts? 💬", body: "Would you like to share something you wrote with your grown-up today?" },
      { title: "Connection time", body: "Your grown-up would love to hear what's on your mind." },
      { title: "Share a moment", body: "Want to show your carer something you've been thinking about?" },
    ],
  },
  carer: {
    insights_summary: [
      { title: "Weekly wellbeing insights", body: "This week showed 3 more calm moments than last week — beautiful progress." },
      { title: "Your child's journey", body: "Here's a gentle summary of your child's emotional patterns this week." },
      { title: "Progress update", body: "Your child has been reflecting on friendships lately — here's what might help." },
    ],
    shared_reflection: [
      { title: "New reflection shared 💙", body: "Your child chose to share a new reflection with you — take a moment to read." },
      { title: "Shared journal entry", body: "Your child has shared something with you. They trust you with their thoughts." },
    ],
    support_tool: [
      { title: "Activity suggestion 🌸", body: "Here's a short grounding activity to try together tonight." },
      { title: "Connection tool", body: "Try this 5-minute calm breathing exercise together." },
    ],
    wellbeing_content: [
      { title: "New resource available", body: "3 gentle conversation starters for anxious moments." },
      { title: "Parenting support", body: "New guide: Supporting your child through difficult emotions." },
    ],
    safeguarding_alert: [
      { title: "Attention needed", body: "Calm Connection has detected a reflection that may need your attention. Please check your dashboard." },
    ],
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    const currentDay = currentTime.toISOString().split('T')[0];

    console.log('Checking notifications at:', currentTimeStr);

    // Check if we're in quiet hours and what type of notification this is
    const isInQuietHours = (quietStart: string, quietEnd: string, enabled: boolean): boolean => {
      if (!enabled) return false;
      
      const current = currentHour * 60 + currentMinute;
      const [startH, startM] = quietStart.split(':').map(Number);
      const [endH, endM] = quietEnd.split(':').map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;

      // Handle overnight quiet hours (e.g., 21:00 to 08:00)
      if (start > end) {
        return current >= start || current < end;
      }
      return current >= start && current < end;
    };

    // Get all users with notification preferences
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('*');

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      throw prefError;
    }

    const notifications: NotificationContent[] = [];

    // Process each user's preferences
    for (const pref of preferences || []) {
      const inQuietHours = isInQuietHours(
        pref.quiet_hours_start,
        pref.quiet_hours_end,
        pref.quiet_hours_enabled
      );

      // Check if we already sent a notification today
      const { data: recentNotif } = await supabase
        .from('notification_history')
        .select('id')
        .eq('user_id', pref.user_id)
        .gte('sent_at', `${currentDay}T00:00:00Z`)
        .limit(1);

      if (recentNotif && recentNotif.length > 0) {
        console.log(`User ${pref.user_id} already received notification today`);
        continue;
      }

      // Process child notifications
      if (pref.role === 'child') {
        // Journal reminders - check if it's the right time
        if (pref.journal_reminders && !inQuietHours) {
          const reminderHour = parseInt(pref.journal_reminder_time.split(':')[0]);
          const reminderMinute = parseInt(pref.journal_reminder_time.split(':')[1]);
          
          if (Math.abs(currentHour - reminderHour) === 0 && Math.abs(currentMinute - reminderMinute) < 15) {
            const messages = notificationMessages.child.journal_reminder;
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            await supabase.from('notification_history').insert({
              user_id: pref.user_id,
              notification_type: 'journal_reminder',
              notification_content: JSON.stringify(message),
            });

            notifications.push({
              type: 'journal_reminder',
              ...message,
              category: 'child',
            });
          }
        }

        // Mood check-ins
        if (pref.mood_checkins && !inQuietHours) {
          // Send based on frequency
          const shouldSend = 
            (pref.mood_checkin_frequency === 'daily' && currentHour === 16) || // 4 PM
            (pref.mood_checkin_frequency === 'twice-daily' && (currentHour === 12 || currentHour === 18));

          if (shouldSend) {
            const messages = notificationMessages.child.mood_checkin;
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            await supabase.from('notification_history').insert({
              user_id: pref.user_id,
              notification_type: 'mood_checkin',
              notification_content: JSON.stringify(message),
            });

            notifications.push({
              type: 'mood_checkin',
              ...message,
              category: 'child',
            });
          }
        }

        // Calm activities - random gentle reminders
        if (pref.calm_activities && !inQuietHours && Math.random() < 0.3 && currentHour >= 15 && currentHour <= 19) {
          const messages = notificationMessages.child.calm_activity;
          const message = messages[Math.floor(Math.random() * messages.length)];
          
          await supabase.from('notification_history').insert({
            user_id: pref.user_id,
            notification_type: 'calm_activity',
            notification_content: JSON.stringify(message),
          });

          notifications.push({
            type: 'calm_activity',
            ...message,
            category: 'child',
          });
        }

        // Encouragement - occasional positive reinforcement
        if (pref.encouragement_messages && !inQuietHours && Math.random() < 0.2) {
          const messages = notificationMessages.child.encouragement;
          const message = messages[Math.floor(Math.random() * messages.length)];
          
          await supabase.from('notification_history').insert({
            user_id: pref.user_id,
            notification_type: 'encouragement',
            notification_content: JSON.stringify(message),
          });

          notifications.push({
            type: 'encouragement',
            ...message,
            category: 'child',
          });
        }
      }

      // Process carer notifications
      if (pref.role === 'carer') {
        // Insights summary - based on frequency setting
        if (pref.insights_summary) {
          const shouldSend =
            (pref.insights_frequency === 'daily' && currentHour === 9 && !inQuietHours) ||
            (pref.insights_frequency === 'weekly' && currentTime.getDay() === 1 && currentHour === 9 && !inQuietHours) ||
            (pref.insights_frequency === 'monthly' && currentTime.getDate() === 1 && currentHour === 9 && !inQuietHours);

          if (shouldSend) {
            const messages = notificationMessages.carer.insights_summary;
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            await supabase.from('notification_history').insert({
              user_id: pref.user_id,
              notification_type: 'insights_summary',
              notification_content: JSON.stringify(message),
            });

            notifications.push({
              type: 'insights_summary',
              ...message,
              category: 'carer',
            });
          }
        }
      }
    }

    console.log(`Processed ${notifications.length} notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: notifications.length,
        notifications 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
