-- Fix #1: Update invite_codes SELECT Policy
DROP POLICY IF EXISTS "Children can view invite codes when linking" ON public.invite_codes;

CREATE POLICY "Children can view unused invite codes"
ON public.invite_codes
FOR SELECT
TO authenticated
USING (
  (used = false) AND (expires_at > now())
);

-- Fix #2: Update children_profiles UPDATE Policy
DROP POLICY IF EXISTS "Children can update own profile" ON public.children_profiles;

CREATE POLICY "Children can update own profile"
ON public.children_profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());