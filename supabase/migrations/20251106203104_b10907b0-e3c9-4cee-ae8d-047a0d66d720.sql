-- Add age column to children_profiles table
ALTER TABLE children_profiles 
ADD COLUMN IF NOT EXISTS age TEXT CHECK (age IN ('child', 'teen'));

-- Set default value for existing users
UPDATE children_profiles 
SET age = 'child' 
WHERE age IS NULL;