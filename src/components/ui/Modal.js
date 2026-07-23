'use client';

import React, { useEffect } from 'react';
import './ui.css';

/**
 * Accessible modal overlay.
 * Closes on backdrop click or ESC key press.
 */
export function Modal({ isOpen, onClose, title, children }) {
  // Close on ESC key — accessibility requirement
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-panel__header">
          <h2 id="modal-title" className="modal-panel__title">{title}</h2>
          <button
            className="modal-panel__close btn btn-ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-panel__body">
          {children}
        </div>
      </div>
    </div>
  );
}
