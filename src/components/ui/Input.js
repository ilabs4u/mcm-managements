import React from 'react';
import './ui.css';

export function Input({ label, ...props }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input className="input-field" {...props} />
    </div>
  );
}
