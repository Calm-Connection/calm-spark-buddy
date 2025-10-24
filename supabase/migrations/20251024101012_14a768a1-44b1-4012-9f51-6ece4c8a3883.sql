-- Fix the RLS policy for children updating invite codes
-- The issue: when setting used=true, the WITH CHECK clause fails because it checks (NOT used)
-- Solution: Add explicit WITH CHECK that allows marking codes as used

-- Drop the old policy
DROP POLICY IF EXISTS "Children can update invite codes when linking" ON public.invite_codes;

-- Create new policy with proper WITH CHECK
CREATE POLICY "Children can update invite codes when linking"
ON public.invite_codes
FOR UPDATE
TO authenticated
USING ((NOT used) AND (expires_at > now()))
WITH CHECK (used = true AND child_user_id IS NOT NULL);