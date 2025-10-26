-- 1. Create missing carer profiles for existing users who don't have them
INSERT INTO public.carer_profiles (user_id, nickname, created_at, updated_at)
SELECT 
  ur.user_id,
  'Carer' as nickname,
  NOW(),
  NOW()
FROM public.user_roles ur
LEFT JOIN public.carer_profiles cp ON cp.user_id = ur.user_id
WHERE ur.role = 'carer' AND cp.id IS NULL;

-- 2. Add NOT NULL constraint on user_id (should already be set, but ensuring)
ALTER TABLE public.carer_profiles 
  ALTER COLUMN user_id SET NOT NULL;

-- 3. Add unique constraint to prevent duplicate profiles
ALTER TABLE public.carer_profiles
  ADD CONSTRAINT carer_profiles_user_id_unique UNIQUE (user_id);

-- 4. Add RLS policy to allow authenticated users to verify carer existence
-- This is needed for children to validate invite codes without exposing sensitive data
CREATE POLICY "Anyone can check carer existence"
ON public.carer_profiles
FOR SELECT
TO authenticated
USING (true);