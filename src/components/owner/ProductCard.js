'use client';

import React, { useState } from 'react';
import RecipeEditor from './RecipeEditor';
import { Badge } from '@/components/ui/Badge';
import ImageUpload from '@/components/ui/ImageUpload';
import './owner.css';

/**
 * ProductCard — expandable card showing product info and its recipe editor.
 */
export default function ProductCard({ product, allIngredients, onSaved }) {
  const [expanded, setExpanded] = useState(false);

  const ingredientCount = product.product_ingredients?.length || 0;

  return (
    <div className={`product-card ${expanded ? 'product-card--expanded' : ''}`}>
      <div className="product-card__header" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__meta">
            {product.packet_size_kg} kg per packet • {ingredientCount} ingredients
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant={product.is_active ? 'open' : 'closed'}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <span className={`product-card__toggle ${expanded ? 'product-card__toggle--open' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {expanded && (
        <div className="product-card__body animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Product Image</h4>
            <ImageUpload
              bucket="uploads"
              pathPrefix="products"
              currentImage={product.image_url}
              onUpload={async (url) => {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                await supabase.from('products').update({ image_url: url }).eq('id', product.id);
                if (onSaved) onSaved();
              }}
            />
          </div>

          <RecipeEditor
            product={product}
            allIngredients={allIngredients}
            onSaved={onSaved}
          />
        </div>
      )}
    </div>
  );
}
