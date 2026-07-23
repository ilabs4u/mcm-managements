import { useState, useEffect } from 'react';
import { API } from '@/lib/constants';

/**
 * Hook for fetching and filtering the franchise list.
 * @param {string} status - 'all' | 'approved' | 'pending' | 'rejected' | 'suspended'
 */
export function useFranchises(status = 'all') {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API.OWNER.FRANCHISES}?status=${status}`);
        const data = await res.json();
        if (data.success) setFranchises(data.data.franchises);
        else setError(data.error);
      } catch {
        setError('Failed to load franchises');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  return { franchises, loading, error };
}
