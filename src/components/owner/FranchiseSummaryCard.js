import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatIngredient } from '@/lib/formatters';
import './owner.css';

/**
 * FranchiseSummaryCard — shows one franchise's today production on the owner dashboard.
 * Receives enriched data from /api/owner/dashboard.
 */
export default function FranchiseSummaryCard({ franchise }) {
  const { name, is_open, manager_name, today } = franchise;
  const isOpen = today?.is_open ?? is_open;

  return (
    <div className={`franchise-card ${!isOpen ? 'franchise-card--closed' : ''}`}>
      <div className="franchise-card__header">
        <div className="franchise-card__name-row">
          <span className={`franchise-card__dot ${isOpen ? 'franchise-card__dot--open' : 'franchise-card__dot--closed'}`} />
          <h3 className="franchise-card__name">{name}</h3>
        </div>
        <Badge variant={isOpen ? 'open' : 'closed'}>{isOpen ? 'Open' : 'Closed'}</Badge>
      </div>

      <p className="franchise-card__manager">{manager_name}</p>

      {today?.products && today.products.length > 0 ? (
        <div className="franchise-card__products">
          {today.products.map((p) => (
            <div key={p.name} className="franchise-card__product-row">
              <span className="franchise-card__product-name">{p.name}</span>
              <span className="franchise-card__product-amount">{p.total_kg} kg</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="franchise-card__no-data">No entries today</p>
      )}

      {today?.materials && today.materials.length > 0 && (
        <div className="franchise-card__materials">
          {today.materials.map((m) => (
            <span key={m.name} className="franchise-card__material-chip">
              {m.name}: {formatIngredient(m.total, m.unit)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
