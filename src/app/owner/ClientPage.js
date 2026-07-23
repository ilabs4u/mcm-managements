'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import TodayAggregateBar from '@/components/owner/TodayAggregateBar';
import FranchiseSummaryCard from '@/components/owner/FranchiseSummaryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { API } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

export default function OwnerDashboard({ franchises: initialFranchises, aggregate: initialAggregate }) {
  const router = useRouter();
  const { signOut, profile } = useAuth();
  const [franchises, setFranchises] = useState(initialFranchises || []);
  const [aggregate, setAggregate] = useState(initialAggregate);

  const initials = profile?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'OW';

  // Realtime: refresh dashboard data when any franchise logs a new entry
  useRealtime(() => {
    fetch(API.OWNER.DASHBOARD)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setFranchises(data.data.franchises);
          setAggregate(data.data.aggregate);
        }
      });
  });

  const handleLogout = async () => {
    await fetch(API.AUTH.LOGOUT, { method: 'POST' });
    await signOut();
    router.push('/login');
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '5rem', gap: '1rem' }}>
      <PageHeader
        title="Overview"
        subtitle={formatDate(new Date())}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
              ) : (
                <div className="avatar-chip">{initials}</div>
              )}
            </Link>
            <button className="logout-link" onClick={handleLogout}>Logout</button>
          </div>
        }
      />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <TodayAggregateBar aggregate={aggregate} />

        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Franchise Status
          </h2>
          {franchises.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {franchises.map((f) => (
                <FranchiseSummaryCard key={f.id} franchise={f} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🏪"
              title="No approved franchises"
              description="Approve franchise applications from the Outlets tab."
            />
          )}
        </div>
      </div>
    </div>
  );
}
