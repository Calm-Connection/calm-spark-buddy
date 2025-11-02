-- Fix 1: Update invite_codes RLS Policy (CRITICAL)
-- Drop the old problematic policy
DROP POLICY IF EXISTS "Children can update invite codes when linking" ON public.invite_codes;

-- Create new policy that allows children to claim unused codes
CREATE POLICY "Children can claim unused invite codes"
ON public.invite_codes
FOR UPDATE
TO authenticated
USING (
  (used = false) 
  AND (expires_at > now())
  AND (child_user_id IS NULL)  -- Can only claim unclaimed codes
)
WITH CHECK (
  (used = true) 
  AND (child_user_id = auth.uid())  -- Can only claim for yourself
);

-- Fix 3: Add DELETE Policy for notification_preferences
CREATE POLICY "Users can delete own notification preferences"
ON public.notification_preferences
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Fix 4: Allow carers to delete flagged entries from linked children
CREATE POLICY "Carers can delete flagged entries from linked children"
ON public.journal_entries
FOR DELETE
TO authenticated
USING (
  (flagged = true) 
  AND (child_id IN (
    SELECT id 
    FROM children_profiles 
    WHERE linked_carer_id = auth.uid()
  ))
);