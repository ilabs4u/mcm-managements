import React from 'react';
import './ui.css';

export function Card({ children, className = '', elevated = false }) {
  return (
    <div className={`card ${elevated ? 'card-elevated' : ''} ${className}`}>
      {children}
    </div>
  );
}
