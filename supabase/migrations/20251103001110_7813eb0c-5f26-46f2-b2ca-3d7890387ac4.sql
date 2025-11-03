-- Create secure function to claim invite codes
CREATE OR REPLACE FUNCTION public.claim_invite_code(_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite_record record;
  _carer_user_id uuid;
  _child_user_id uuid;
BEGIN
  -- Get the authenticated user ID
  _child_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF _child_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'not_authenticated',
      'message', 'You must be logged in to claim a code'
    );
  END IF;

  -- Find and lock the invite code record
  SELECT * INTO _invite_record
  FROM invite_codes
  WHERE code = UPPER(_code)
    AND used = false
    AND expires_at > now()
    AND child_user_id IS NULL
  FOR UPDATE;

  -- Check if code was found
  IF NOT FOUND THEN
    -- Check specific failure reasons
    IF EXISTS (SELECT 1 FROM invite_codes WHERE code = UPPER(_code) AND used = true) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'code_used',
        'message', 'This code has already been used'
      );
    ELSIF EXISTS (SELECT 1 FROM invite_codes WHERE code = UPPER(_code) AND expires_at <= now()) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'code_expired',
        'message', 'This code has expired'
      );
    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'error', 'code_not_found',
        'message', 'This code doesn''t exist'
      );
    END IF;
  END IF;

  _carer_user_id := _invite_record.carer_user_id;

  -- Verify carer profile exists
  IF NOT EXISTS (SELECT 1 FROM carer_profiles WHERE user_id = _carer_user_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'carer_not_found',
      'message', 'The carer account hasn''t completed setup yet'
    );
  END IF;

  -- Mark code as used
  UPDATE invite_codes
  SET used = true,
      child_user_id = _child_user_id
  WHERE id = _invite_record.id;

  -- Return success with carer_user_id for frontend to update profile
  RETURN jsonb_build_object(
    'success', true,
    'carer_user_id', _carer_user_id
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.claim_invite_code(text) TO authenticated;