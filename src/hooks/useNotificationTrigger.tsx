import { supabase } from '@/integrations/supabase/client';

interface NotificationMessage {
  title: string;
  body: string;
}

/**
 * Hook to trigger event-based notifications
 * Use this for immediate notifications like shared journal entries or safeguarding alerts
 */
export function useNotificationTrigger() {
  const triggerNotification = async (
    userId: string,
    type: string,
    message: NotificationMessage
  ) => {
    try {
      const { error } = await supabase.from('notification_history').insert({
        user_id: userId,
        notification_type: type,
        notification_content: JSON.stringify(message),
      });

      if (error) {
        console.error('Error triggering notification:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to trigger notification:', error);
      return { success: false, error };
    }
  };

  /**
   * Notify carer when child shares a journal entry
   */
  const notifySharedEntry = async (carerId: string, childName?: string) => {
    await triggerNotification(carerId, 'shared_reflection', {
      title: 'New reflection shared 💙',
      body: childName
        ? `${childName} chose to share a new reflection with you — take a moment to read.`
        : 'Your child chose to share a new reflection with you — take a moment to read.',
    });
  };

  /**
   * Send safeguarding alert to carer (CRITICAL - bypasses quiet hours)
   */
  const notifySafeguardingAlert = async (
    carerId: string,
    severity: 'medium' | 'high' | 'critical'
  ) => {
    const messages = {
      medium: {
        title: 'Wellbeing check suggested',
        body: 'Calm Connection detected patterns that suggest checking in with your child might be helpful. Please review the insights when you have a moment.',
      },
      high: {
        title: 'Attention needed',
        body: 'Calm Connection has detected a reflection that may need your attention. Please check your dashboard for more information.',
      },
      critical: {
        title: 'Urgent: Please check in',
        body: 'Calm Connection has flagged concerning content that requires your immediate attention. Please review the safeguarding dashboard.',
      },
    };

    await triggerNotification(carerId, 'safeguarding_alert', messages[severity]);
  };

  /**
   * Remind carer when child hasn't engaged recently
   */
  const notifyInactiveChild = async (carerId: string, daysSinceLastEntry: number) => {
    await triggerNotification(carerId, 'engagement_reminder', {
      title: 'Gentle check-in reminder',
      body: `Your child hasn't checked in for ${daysSinceLastEntry} days. It might be a good time to see how they're doing.`,
    });
  };

  /**
   * Notify about new wellbeing resource
   */
  const notifyNewResource = async (userId: string, resourceTitle: string) => {
    await triggerNotification(userId, 'wellbeing_content', {
      title: 'New resource available',
      body: resourceTitle,
    });
  };

  return {
    triggerNotification,
    notifySharedEntry,
    notifySafeguardingAlert,
    notifyInactiveChild,
    notifyNewResource,
  };
}
