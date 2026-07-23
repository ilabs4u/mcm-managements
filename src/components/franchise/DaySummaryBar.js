import React from 'react';
import { aggregateMaterials } from '@/lib/calculations';
import { formatIngredient } from '@/lib/formatters';
import './franchise.css';

/**
 * DaySummaryBar — sticky footer showing today's total production and material usage.
 * Aggregates across all entries using the frozen material_breakdown snapshots.
 */
export default function DaySummaryBar({ items }) {
  if (!items || items.length === 0) return null;

  // Aggregate total kg per product
  const productTotals = {};
  items.forEach((item) => {
    const name = item.material_breakdown?.product_name || item.products?.name || 'Unknown';
    if (!productTotals[name]) productTotals[name] = { kg: 0, packets: 0 };
    productTotals[name].kg += item.quantity_kg;
    productTotals[name].packets += item.quantity_packets;
  });

  // Aggregate total materials across all entries
  const materialTotals = aggregateMaterials(items);

  return (
    <div className="day-summary">
      <p className="day-summary__label">Today&apos;s Total</p>
      <div className="day-summary__products">
        {Object.entries(productTotals).map(([name, totals]) => (
          <div key={name} className="day-summary__product">
            <span className="day-summary__product-name">{name}</span>
            <span className="day-summary__product-amount">{totals.kg} kg</span>
          </div>
        ))}
      </div>
      {materialTotals.length > 0 && (
        <div className="day-summary__materials">
          {materialTotals.map((m) => (
            <span key={m.name} className="day-summary__material-chip">
              {m.name}: {formatIngredient(m.total, m.unit)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
