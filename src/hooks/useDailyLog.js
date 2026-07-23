import { useState } from 'react';
import { API } from '@/lib/constants';

/**
 * Hook for managing today's daily log CRUD operations.
 * Provides addEntry, deleteEntry, and toggleOpen with loading + error state.
 */
export function useDailyLog() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addEntry = async (product_id, quantity_kg) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(API.FRANCHISE.ENTRIES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, quantity_kg }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data.data.entry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`${API.FRANCHISE.ENTRIES}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleOpen = async (is_open) => {
    try {
      const res = await fetch(API.FRANCHISE.TOGGLE_OPEN, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_open }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { addEntry, deleteEntry, toggleOpen, submitting, error };
}
