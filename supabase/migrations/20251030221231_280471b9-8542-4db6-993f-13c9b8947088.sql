-- Add DELETE policy for journal entries so children can delete their own entries
CREATE POLICY "Children can delete own journal entries"
ON journal_entries
FOR DELETE
TO authenticated
USING (
  child_id IN (
    SELECT id 
    FROM children_profiles 
    WHERE user_id = auth.uid()
  )
);