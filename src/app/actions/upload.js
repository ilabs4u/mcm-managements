'use server';

import { createAdminClient } from '@/lib/supabase/server';

export async function uploadImageAction(bucket, filePath, formData) {
  try {
    const file = formData.get('file');
    if (!file) {
      throw new Error('No file provided');
    }

    const supabase = await createAdminClient();

    // Use service role to bypass RLS for uploads
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    
    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }
}
