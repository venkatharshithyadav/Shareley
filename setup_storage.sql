-- Check if the storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'listing-images';

-- If the above returns no rows, create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images', 
  'listing-images', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the bucket
-- Policy 1: Allow public read access
CREATE POLICY IF NOT EXISTS "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

-- Policy 2: Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Policy 3: Allow authenticated users to update their files
CREATE POLICY IF NOT EXISTS "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-images');

-- Policy 4: Allow authenticated users to delete their files
CREATE POLICY IF NOT EXISTS "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images');

-- Verify policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
