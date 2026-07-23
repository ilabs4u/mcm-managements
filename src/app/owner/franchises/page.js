'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFranchises } from '@/hooks/useFranchises';
import { Spinner } from '@/components/ui/Spinner';
import Link from 'next/link';

const STATUS_TABS = ['all', 'approved', 'pending', 'rejected', 'suspended'];

export default function FranchisesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { franchises, loading } = useFranchises(activeTab);

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '5rem' }}>
      <PageHeader title="Outlets" subtitle="All franchise locations" backHref="/owner" />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: '500',
                cursor: 'pointer',
                border: '1px solid',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                background: activeTab === tab ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                borderColor: activeTab === tab ? 'var(--brand-primary)' : 'var(--border-subtle)',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size="lg" />
          </div>
        ) : franchises.length === 0 ? (
          <EmptyState icon="🏪" title={`No ${activeTab === 'all' ? '' : activeTab} franchises`} description="Change the filter or register new franchises." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {franchises.map((f) => (
              <Link key={f.id} href={`/owner/franchises/${f.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all var(--transition-fast)',
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{f.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      {f.profiles?.full_name || 'No manager'} {f.location ? `• ${f.location}` : ''}
                    </div>
                  </div>
                  <Badge variant={f.status}>{f.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

