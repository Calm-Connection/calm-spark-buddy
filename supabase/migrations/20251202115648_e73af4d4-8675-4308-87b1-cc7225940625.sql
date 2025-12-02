-- Add INSERT policy for notification_history
CREATE POLICY "Users can insert own notifications"
ON notification_history
FOR INSERT
WITH CHECK (user_id = auth.uid());