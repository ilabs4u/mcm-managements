import { useAuthContext } from '@/context/AuthContext';

/**
 * Hook to access auth state and actions from any client component.
 *
 * Returns: { user, profile, role, franchise, loading, signOut }
 *
 * Usage:
 *   const { user, role, signOut } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}
