'use server';

import { createAdminClient } from '@/lib/supabase/server';

export async function createFranchiseProfile(formData) {
  try {
    const { email, password, full_name, phone, franchise_name, franchise_location } = formData;

    const supabase = await createAdminClient();

    // Step 1: Create Supabase Auth user with email_confirm: true
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm so they don't get "Email not confirmed" error
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return { success: false, error: authError.message };
    }

    const userId = authData.user.id;

    // Step 2: Insert profile row
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name,
        email,
        phone: phone || null,
        role: 'franchise_manager',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Cleanup auth user if profile fails
      await supabase.auth.admin.deleteUser(userId);
      return { success: false, error: 'Failed to create profile: ' + profileError.message };
    }

    // Step 3: Insert franchise row with pending status
    const { data: franchiseData, error: franchiseError } = await supabase
      .from('franchises')
      .insert({
        name: franchise_name,
        location: franchise_location || null,
        manager_id: userId,
        status: 'pending',
      })
      .select('id')
      .single();

    if (franchiseError) {
      console.error('Franchise creation error:', franchiseError);
      // Cleanup auth user if franchise fails
      await supabase.auth.admin.deleteUser(userId);
      return { success: false, error: 'Failed to create franchise: ' + franchiseError.message };
    }

    return {
      success: true,
      data: { userId, franchiseId: franchiseData.id },
    };
  } catch (err) {
    console.error('Internal server error:', err);
    return { success: false, error: 'Internal server error' };
  }
}
