'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { API } from '@/lib/constants';
import './owner.css';

/**
 * RecipeEditor — editable ingredient list for a product.
 * Shows current ingredients with editable quantity fields.
 * Saves by replacing all recipe rows (PUT /api/products/[id]/recipe).
 */
export default function RecipeEditor({ product, allIngredients, onSaved }) {
  const currentIngredients = product.product_ingredients || [];

  const [rows, setRows] = useState(
    currentIngredients.map((pi) => ({
      ingredient_id: pi.ingredients?.id || pi.ingredient_id,
      name: pi.ingredients?.name || 'Unknown',
      quantity_per_packet: pi.quantity_per_packet,
      unit: pi.unit,
    }))
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateRow = (idx, field, value) => {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
    setSuccess(false);
  };

  const addIngredient = () => {
    const unused = allIngredients.find((ing) => !rows.find((r) => r.ingredient_id === ing.id));
    if (!unused) return;
    setRows((prev) => [...prev, { ingredient_id: unused.id, name: unused.name, quantity_per_packet: 0, unit: unused.unit }]);
    setSuccess(false);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API.PRODUCTS}/${product.id}/recipe`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: rows }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        onSaved?.();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
        Ingredients per 1 packet ({product.packet_size_kg} kg)
      </p>

      {rows.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No ingredients configured
        </p>
      ) : (
        <div>
          {rows.map((row, idx) => (
            <div key={row.ingredient_id} className="recipe-editor__row">
              <span className="recipe-editor__ingredient-name">{row.name}</span>
              <input
                className="recipe-editor__qty-input"
                type="number"
                value={row.quantity_per_packet}
                min="0"
                step="0.01"
                onChange={(e) => updateRow(idx, 'quantity_per_packet', parseFloat(e.target.value) || 0)}
              />
              <span className="recipe-editor__unit">{row.unit}</span>
              <button
                onClick={() => removeRow(idx)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', fontSize: '1rem' }}
                aria-label={`Remove ${row.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-2)' }}>
        {allIngredients.length > rows.length && (
          <Button variant="secondary" style={{ flex: 1 }} onClick={addIngredient}>
            + Add Ingredient
          </Button>
        )}
        <Button
          variant="primary"
          style={{ flex: 1 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : success ? '✓ Saved!' : 'Save Recipe'}
        </Button>
      </div>
    </div>
  );
}
