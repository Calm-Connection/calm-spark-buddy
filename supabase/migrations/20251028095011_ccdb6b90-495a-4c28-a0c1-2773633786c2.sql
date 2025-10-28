-- Create storage bucket for journal voice notes
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-voice-notes', 'journal-voice-notes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for voice notes
CREATE POLICY "Children can upload their own voice notes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'journal-voice-notes');

CREATE POLICY "Anyone can view voice notes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'journal-voice-notes');