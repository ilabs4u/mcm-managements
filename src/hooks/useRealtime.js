import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Supabase Realtime subscription hook.
 * Subscribes to INSERT events on daily_log_items table.
 * WHY: Owner dashboard must update live when any franchise logs new production.
 *
 * @param {Function} onInsert - Callback invoked with the new row payload
 */
export function useRealtime(onInsert) {
  const callbackRef = useRef(onInsert);
  callbackRef.current = onInsert;

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('daily-log-items-inserts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'daily_log_items',
        },
        (payload) => {
          callbackRef.current(payload.new);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty deps — subscribe once and use ref for callback
}
