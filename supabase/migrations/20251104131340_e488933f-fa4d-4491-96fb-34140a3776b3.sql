-- Add gender column to children_profiles table
ALTER TABLE children_profiles 
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'prefer_not_to_say'));