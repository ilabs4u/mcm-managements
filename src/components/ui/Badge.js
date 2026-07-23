import React from 'react';
import './ui.css';

/**
 * Status badge component for franchise states and open/close indicators.
 * Variants: open, closed, pending, approved, rejected, suspended, info
 */
export function Badge({ children, variant = 'info', className = '' }) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  );
}
