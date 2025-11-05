-- Add carer_actions column to wendy_insights for specific actionable suggestions
ALTER TABLE wendy_insights 
ADD COLUMN carer_actions JSONB;

-- Add DELETE policy for notifications so carers can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notification_history FOR DELETE
USING (user_id = auth.uid());