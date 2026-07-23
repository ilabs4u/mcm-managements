'use client';

import React, { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import PastEntryRow from './PastEntryRow';
import './franchise.css';

/**
 * EntryHistoryList — scrollable list of today's production entries.
 * Handles optimistic delete (removes from list immediately on success).
 */
export default function EntryHistoryList({ entries: initialEntries }) {
  const [entries, setEntries] = useState(initialEntries || []);

  const handleDelete = (deletedId) => {
    setEntries((prev) => prev.filter((e) => e.id !== deletedId));
  };

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No entries yet"
        description="Add your first production entry above."
      />
    );
  }

  return (
    <div className="entry-history">
      <h3 className="entry-history__title">Today&apos;s Entries</h3>
      <div className="entry-history__list">
        {entries.map((entry) => (
          <PastEntryRow key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
