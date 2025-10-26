-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Children can update invite codes when linking" ON public.invite_codes;

-- Create corrected policy with proper USING clause
CREATE POLICY "Children can update invite codes when linking"
ON public.invite_codes
FOR UPDATE
TO authenticated
USING (
  -- Any authenticated user can access unused, non-expired codes for potential update
  -- This is safe because WITH CHECK enforces who can actually complete the update
  (used = false) AND (expires_at > now())
)
WITH CHECK (
  -- After update, the code MUST be marked used AND linked to the current user
  -- This is where security is enforced
  (used = true) AND (child_user_id = auth.uid())
);