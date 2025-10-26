-- Drop the existing SELECT policy for children
DROP POLICY IF EXISTS "Children can view invite codes when linking" ON public.invite_codes;

-- Create a more explicit SELECT policy
CREATE POLICY "Children can view invite codes when linking"
ON public.invite_codes
FOR SELECT
TO authenticated
USING (
  -- Any authenticated user can SELECT unused, non-expired codes
  -- This allows them to find codes by the 'code' field
  (used = false) AND (expires_at > now())
);