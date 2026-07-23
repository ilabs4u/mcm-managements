'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import ProductCard from '@/components/owner/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/useProducts';

export default function RecipesPage() {
  const { products, ingredients, loading, reload } = useProducts();

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '5rem' }}>
      <PageHeader
        title="Recipes"
        subtitle="Configure products and ingredients"
        backHref="/owner"
      />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🍛"
            title="No products configured"
            description="Add products via the Supabase SQL editor or API."
          />
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              allIngredients={ingredients}
              onSaved={reload}
            />
          ))
        )}
      </div>
    </div>
  );
}

