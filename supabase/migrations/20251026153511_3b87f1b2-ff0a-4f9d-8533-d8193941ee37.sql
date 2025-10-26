-- Drop the existing policy
DROP POLICY IF EXISTS "Children can update invite codes when linking" ON public.invite_codes;

-- Create corrected policy that verifies child_user_id matches auth.uid()
CREATE POLICY "Children can update invite codes when linking"
ON public.invite_codes
FOR UPDATE
TO authenticated
USING (
  -- Can only update codes that are unused and not expired
  (NOT used) AND (expires_at > now())
)
WITH CHECK (
  -- After update, code must be marked used with the current user's ID
  (used = true) AND (child_user_id = auth.uid())
);