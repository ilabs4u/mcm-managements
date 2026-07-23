import React from 'react';
import { formatIngredient } from '@/lib/formatters';
import './franchise.css';

/**
 * MaterialBreakdown — read-only display of calculated material usage.
 * Used for live preview in entry form AND in past entry history rows.
 */
export default function MaterialBreakdown({ packets, ingredients }) {
  return (
    <div className="material-breakdown animate-fade-in">
      <p className="material-breakdown__label">Material Usage Preview</p>
      <div className="material-breakdown__grid">
        <div className="material-breakdown__item">
          <span className="material-breakdown__value material-breakdown__value--packets">
            {packets}
          </span>
          <span className="material-breakdown__unit">Packets</span>
        </div>
        {ingredients.map((ing) => (
          <div key={ing.name} className="material-breakdown__item">
            <span className="material-breakdown__value">
              {formatIngredient(ing.quantity, ing.unit)}
            </span>
            <span className="material-breakdown__unit">{ing.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
