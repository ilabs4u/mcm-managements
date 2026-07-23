'use client';

import React, { useState } from 'react';
import { API } from '@/lib/constants';
import './franchise.css';

/**
 * OpenCloseToggle — lets franchise manager mark the outlet open or closed.
 * Calls the toggle-open API and gives visual feedback.
 */
export default function OpenCloseToggle({ isOpen: initialIsOpen, onToggle }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newState = !isOpen;
    try {
      const res = await fetch(API.FRANCHISE.TOGGLE_OPEN, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_open: newState }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOpen(newState);
        onToggle?.(newState);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="open-close-toggle">
      <div className="open-close-toggle__status">
        <span
          className={`open-close-toggle__dot ${isOpen ? 'open-close-toggle__dot--open' : 'open-close-toggle__dot--closed'}`}
        />
        <span className="open-close-toggle__label">
          {isOpen ? 'Outlet Open' : 'Outlet Closed'}
        </span>
      </div>
      <button
        id="toggle-open-close"
        className={`open-close-toggle__btn ${isOpen ? 'open-close-toggle__btn--close' : 'open-close-toggle__btn--open'}`}
        onClick={handleToggle}
        disabled={loading}
        aria-label={isOpen ? 'Mark outlet as closed' : 'Mark outlet as open'}
      >
        {loading ? '…' : isOpen ? 'Close for Day' : 'Reopen'}
      </button>
    </div>
  );
}
