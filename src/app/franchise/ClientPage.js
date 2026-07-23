'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import OpenCloseToggle from '@/components/franchise/OpenCloseToggle';
import ProductionEntryCard from '@/components/franchise/ProductionEntryCard';
import EntryHistoryList from '@/components/franchise/EntryHistoryList';
import DaySummaryBar from '@/components/franchise/DaySummaryBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useDailyLog } from '@/hooks/useDailyLog';
import { API } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

export default function FranchisePortal({ franchise, log: initialLog, items: initialItems, products }) {
  const router = useRouter();
  const { signOut, profile } = useAuth();
  const { addEntry, submitting } = useDailyLog();
  const [items, setItems] = useState(initialItems || []);
  const [error, setError] = useState(null);

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'FM';

  const handleAddEntry = async (product_id, quantity_kg) => {
    setError(null);
    try {
      const newEntry = await addEntry(product_id, quantity_kg);
      // Prepend new entry to list — optimistic UI
      setItems((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError(err.message || 'Failed to add entry');
    }
  };

  const handleLogout = async () => {
    await fetch(API.AUTH.LOGOUT, { method: 'POST' });
    await signOut();
    router.push('/login');
  };

  const today = formatDate(new Date());

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '5rem', gap: '1rem' }}>
      <PageHeader
        title={franchise?.name || 'My Franchise'}
        subtitle={today}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
              ) : (
                <div className="avatar-chip">{initials}</div>
              )}
            </Link>
            <button className="logout-link" onClick={handleLogout}>Logout</button>
          </div>
        }
      />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <OpenCloseToggle isOpen={franchise?.is_open ?? true} />

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-error)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductionEntryCard
                key={product.id}
                product={product}
                onAddEntry={handleAddEntry}
                isSubmitting={submitting}
              />
            ))
          ) : (
            <EmptyState
              icon="🍛"
              title="No products configured"
              description="The owner hasn't set up any products yet."
            />
          )}
        </div>

        {items.length > 0 && <DaySummaryBar items={items} />}

        <EntryHistoryList entries={items} />
      </div>
    </div>
  );
}
