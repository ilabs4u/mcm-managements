import React from 'react';
import { formatTime } from '@/lib/formatters';
import { API } from '@/lib/constants';
import './franchise.css';

/**
 * PastEntryRow — a single production entry in today's entry history list.
 * Shows product name, time, quantity, packets, and a delete button.
 */
export default function PastEntryRow({ entry, onDelete }) {
  const breakdown = entry.material_breakdown || {};
  const productName = breakdown.product_name || entry.products?.name || 'Unknown';

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return;
    const res = await fetch(`${API.FRANCHISE.ENTRIES}/${entry.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) onDelete(entry.id);
  };

  return (
    <div className="entry-row animate-fade-in">
      <div className="entry-row__info">
        <span className="entry-row__product">{productName}</span>
        <span className="entry-row__time">{formatTime(entry.created_at)}</span>
      </div>
      <div className="entry-row__amounts">
        <span className="entry-row__kg">{entry.quantity_kg} kg</span>
        <span className="entry-row__packets">{entry.quantity_packets} pkt</span>
      </div>
      <button
        className="entry-row__delete"
        onClick={handleDelete}
        aria-label="Delete entry"
        title="Delete this entry"
      >
        ✕
      </button>
    </div>
  );
}
