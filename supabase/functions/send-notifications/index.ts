import { createClient } from 'npm:@supabase/supabase-js@2';

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
      { 
        title: "Attention needed", 
        body: "Calm Connection has detected a reflection that may need your attention. Please check your dashboard.\n\n24/7 Support:\nChildLine: 0800 1111\nSamaritans: 116 123\nShout Crisis Text: Text SHOUT to 85258" 
      },
    ],
    crisis_support: [
      {
        title: "Support available 24/7",
        body: "If you or your child need immediate support:\n\nChildLine: 0800 1111\nSamaritans: 116 123\nShout Crisis: Text SHOUT to 85258\nNSPCC: 0808 800 5000"
      },
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
    let notificationsSent = 0;
    const processedNotifications: any[] = [];

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

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

        // Connection prompts - gentle reminders to share with carer (moved from carer section)
        if (pref.connection_prompts && !inQuietHours && Math.random() < 0.15 && currentHour >= 17 && currentHour <= 20) {
          const messages = notificationMessages.child.connection_prompt;
          const message = messages[Math.floor(Math.random() * messages.length)];
          
          await supabase.from('notification_history').insert({
            user_id: pref.user_id,
            notification_type: 'connection_prompt',
            notification_content: JSON.stringify(message),
          });

          notifications.push({
            type: 'connection_prompt',
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

    // PHASE 4: Inactivity Detection for Carers
    console.log('Checking for inactive children...');
    const { data: carerProfiles } = await supabaseAdmin
      .from('carer_profiles')
      .select('id, user_id, nickname');

    if (carerProfiles) {
      for (const carer of carerProfiles) {
        // Get linked children
        const { data: linkedChildren } = await supabaseAdmin
          .from('children_profiles')
          .select('id, nickname, user_id')
          .eq('linked_carer_id', carer.user_id);

        if (linkedChildren) {
          for (const child of linkedChildren) {
            // Check last journal entry
            const { data: lastEntry } = await supabaseAdmin
              .from('journal_entries')
              .select('created_at')
              .eq('child_id', child.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (lastEntry) {
              const daysSinceLastEntry = Math.floor(
                (now.getTime() - new Date(lastEntry.created_at).getTime()) / (1000 * 60 * 60 * 24)
              );

              // Alert if inactive for 5+ days
              if (daysSinceLastEntry >= 5) {
                // Check if we already sent this alert today
                const { data: alreadySent } = await supabaseAdmin
                  .from('notification_history')
                  .select('id')
                  .eq('user_id', carer.user_id)
                  .eq('notification_type', 'engagement_reminder')
                  .gte('sent_at', todayStart.toISOString())
                  .maybeSingle();

                if (!alreadySent) {
                  await supabaseAdmin.from('notification_history').insert({
                    user_id: carer.user_id,
                    notification_type: 'engagement_reminder',
                    notification_content: JSON.stringify({
                      title: 'Gentle check-in reminder 💙',
                      body: `${child.nickname || 'Your child'} hasn't checked in for ${daysSinceLastEntry} days. A simple "How are you?" can open the door to connection.\n\nRemember: Their wellbeing matters, and so does giving them space to share when ready.`,
                    }),
                  });
                  notificationsSent++;
                  console.log(`Sent inactivity alert for child ${child.id} to carer ${carer.user_id}`);
                }
              }
            }
          }
        }
      }
    }

    // PHASE 4: Weekly Insights Summary for Carers (Mondays at 9am)
    if (now.getDay() === 1 && currentHour === 9) {
      console.log('Generating weekly insights summaries...');
      
      if (carerProfiles) {
        for (const carer of carerProfiles) {
          const { data: linkedChildren } = await supabaseAdmin
            .from('children_profiles')
            .select('id, nickname')
            .eq('linked_carer_id', carer.user_id);

          if (linkedChildren && linkedChildren.length > 0) {
            for (const child of linkedChildren) {
              // Get insights from the past week
              const weekAgo = new Date(now);
              weekAgo.setDate(weekAgo.getDate() - 7);

              const { data: weeklyInsights } = await supabaseAdmin
                .from('wendy_insights')
                .select('mood_score, themes, summary')
                .eq('child_id', child.id)
                .gte('created_at', weekAgo.toISOString())
                .order('created_at', { ascending: false });

              if (weeklyInsights && weeklyInsights.length > 0) {
                // Calculate average mood
                const avgMood = weeklyInsights.reduce((sum, i) => sum + (i.mood_score || 5), 0) / weeklyInsights.length;
                const moodTrend = avgMood >= 6 ? 'positive' : avgMood >= 4 ? 'stable' : 'needs attention';

                // Extract common themes
                const allThemes: string[] = [];
                weeklyInsights.forEach((insight: any) => {
                  if (insight.themes && Array.isArray(insight.themes)) {
                    allThemes.push(...insight.themes);
                  }
                });
                const themeCount: Record<string, number> = allThemes.reduce((acc: any, theme: string) => {
                  acc[theme] = (acc[theme] || 0) + 1;
                  return acc;
                }, {});
                const topThemes = Object.entries(themeCount)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 3)
                  .map(([theme]) => theme);

                await supabaseAdmin.from('notification_history').insert({
                  user_id: carer.user_id,
                  notification_type: 'insights_summary',
                  notification_content: JSON.stringify({
                    title: `${child.nickname}'s weekly wellbeing summary 🌟`,
                    body: `Mood trend: ${moodTrend}. ${topThemes.length > 0 ? `Recurring themes: ${topThemes.join(', ')}.` : ''} ${weeklyInsights.length} reflections this week.\n\nRemember: These insights support connection, not surveillance. Use them to understand, not to judge.`,
                  }),
                });
                notificationsSent++;
                console.log(`Sent weekly summary for child ${child.id} to carer ${carer.user_id}`);
              }
            }
          }
        }
      }
    }

    console.log(`Processed ${notificationsSent} notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: notificationsSent,
        processed: processedNotifications.length,
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
