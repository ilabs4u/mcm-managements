'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateProfile(userId, formData) {
  try {
    const supabase = await createClient();
    
    // Security check: Only update own profile unless owner (handled by RLS as well)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
      })
      .eq('id', userId);

    if (error) throw error;
    
    return { success: true };
  } catch (err) {
    console.error('Update profile error:', err);
    return { success: false, error: err.message };
  }
}
