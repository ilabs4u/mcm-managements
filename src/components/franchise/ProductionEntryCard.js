'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateMaterials } from '@/lib/calculations';
import { formatQuantity } from '@/lib/formatters';
import MaterialBreakdown from './MaterialBreakdown';
import './franchise.css';

/**
 * ProductionEntryCard — one card per product.
 * Shows kg input, live material preview, and Add Entry button.
 * Client-side calc is for preview only — server recalculates on save.
 */
export default function ProductionEntryCard({ product, onAddEntry, isSubmitting }) {
  const [quantity, setQuantity] = useState('');

  const qty = parseFloat(quantity);
  const hasValidQty = !isNaN(qty) && qty > 0;

  // Build recipe from product_ingredients join data
  const recipe = (product.product_ingredients || []).map((pi) => ({
    name: pi.ingredients?.name || pi.name,
    quantity_per_packet: pi.quantity_per_packet,
    unit: pi.unit,
  }));

  // Live preview — client-side only, not saved to DB
  const preview = hasValidQty
    ? calculateMaterials(qty, product.packet_size_kg, recipe)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasValidQty) return;
    await onAddEntry(product.id, qty);
    setQuantity('');
  };

  // Fallback to the old method if image_url is missing
  const imageName = product.name.toLowerCase().replace(' ', '_');
  const fallbackSrc = `/images/products/${imageName}.png`;
  const imageSrc = product.image_url || fallbackSrc;

  return (
    <div className="entry-card glass-panel animate-fade-in">
      <div className="entry-card__header">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img src={imageSrc} alt={product.name} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
          <div>
            <h3 className="entry-card__name">{product.name}</h3>
            <p className="entry-card__meta">1 packet = {product.packet_size_kg} kg</p>
          </div>
        </div>
      </div>

      <form className="entry-card__form" onSubmit={handleSubmit}>
        <div className="entry-card__input-row">
          <Input
            id={`qty-${product.id}`}
            label="Quantity Produced (kg)"
            type="number"
            placeholder={`e.g. ${product.packet_size_kg}`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.1"
            step="0.1"
          />
        </div>

        {preview && (
          <MaterialBreakdown
            packets={preview.packets}
            ingredients={preview.ingredients}
          />
        )}

        <Button
          id={`add-${product.id}`}
          type="submit"
          variant="primary"
          disabled={!hasValidQty || isSubmitting}
          style={{ marginTop: '0.75rem' }}
        >
          {isSubmitting ? 'Adding…' : '+ Add Entry'}
        </Button>
      </form>
    </div>
  );
}
