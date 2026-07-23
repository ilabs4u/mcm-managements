import React from 'react';
import './ui.css';

/**
 * Loading spinner for async states.
 * Size: sm (16px), md (24px), lg (40px)
 */
export function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`spinner spinner--${size} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
