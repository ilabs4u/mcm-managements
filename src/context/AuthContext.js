'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * AuthContext — provides user, role, franchise, and loading state to all client components.
 *
 * WHY: Rather than prop-drilling auth state through every component,
 * we use context so any component can call useAuth() and get what it needs.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [franchise, setFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserData(session.user);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setFranchise(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (authUser) => {
    setUser(authUser);

    // Fetch profile (role)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    setProfile(profileData);

    // Fetch franchise if they are a manager
    if (profileData?.role === 'franchise_manager') {
      const { data: franchiseData } = await supabase
        .from('franchises')
        .select('*')
        .eq('manager_id', authUser.id)
        .single();
      setFranchise(franchiseData);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setFranchise(null);
  };

  const value = {
    user,
    profile,
    role: profile?.role ?? null,
    franchise,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
