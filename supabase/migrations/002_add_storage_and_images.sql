-- 1. Add image_url to tables
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create the Storage Bucket for uploads (must be public so UI can read images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS on storage.objects
-- Note: Storage RLS uses the storage.objects table
-- Allow public read access to the uploads bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own uploads" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'uploads' AND 
  auth.uid() = owner
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own uploads" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'uploads' AND 
  auth.uid() = owner
);
