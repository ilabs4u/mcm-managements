import React from 'react';
import './ui.css';

export function Skeleton({ width, height, borderRadius = 'var(--radius-md)', className = '', style = {} }) {
  return (
    <div 
      className={`skeleton ${className}`} 
      style={{ 
        width, 
        height, 
        borderRadius, 
        ...style 
      }} 
    />
  );
}
