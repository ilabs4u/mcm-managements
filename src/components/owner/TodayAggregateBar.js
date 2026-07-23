import React from 'react';
import { formatIngredient } from '@/lib/formatters';
import './owner.css';

/**
 * TodayAggregateBar — cross-franchise totals at the top of the owner dashboard.
 * Shows open count, total franchise count, product totals, and material totals.
 */
export default function TodayAggregateBar({ aggregate }) {
  if (!aggregate) return null;

  const { open_count, total_franchises, products, materials } = aggregate;

  return (
    <div className="aggregate-bar">
      <div className="aggregate-bar__header">
        <h2 className="aggregate-bar__title">Today&apos;s Overview</h2>
        <div className="live-indicator">
          <span className="live-indicator__dot" />
          Live
        </div>
      </div>

      <div className="aggregate-bar__counts">
        <div className="aggregate-bar__stat">
          <span className="aggregate-bar__stat-value" style={{ color: 'var(--status-success)' }}>
            {open_count}
          </span>
          <span className="aggregate-bar__stat-label">Open</span>
        </div>
        <div className="aggregate-bar__divider" />
        <div className="aggregate-bar__stat">
          <span className="aggregate-bar__stat-value">{total_franchises}</span>
          <span className="aggregate-bar__stat-label">Total</span>
        </div>
      </div>

      {products && products.length > 0 && (
        <div className="aggregate-bar__products">
          {products.map((p) => (
            <div key={p.name} className="aggregate-bar__product">
              <span className="aggregate-bar__product-name">{p.name}</span>
              <span className="aggregate-bar__product-value">{p.total_kg} kg</span>
            </div>
          ))}
        </div>
      )}

      {materials && materials.length > 0 && (
        <div className="aggregate-bar__materials">
          {materials.map((m) => (
            <div key={m.name} className="aggregate-bar__material">
              <span className="aggregate-bar__material-name">{m.name}</span>
              <span className="aggregate-bar__material-value">
                {formatIngredient(m.total, m.unit)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
