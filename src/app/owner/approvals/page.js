'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import ApprovalCard from '@/components/owner/ApprovalCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFranchises } from '@/hooks/useFranchises';
import { Spinner } from '@/components/ui/Spinner';

// Approvals page — shows pending franchise applications for owner review
export default function ApprovalsPage() {
  const { franchises: pending, loading } = useFranchises('pending');
  const [dismissed, setDismissed] = useState([]);

  const visible = pending.filter((f) => !dismissed.includes(f.id));

  const handleUpdate = (id) => {
    // Remove from visible list after approve/reject
    setDismissed((prev) => [...prev, id]);
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '5rem' }}>
      <PageHeader
        title="Approvals"
        subtitle={`${visible.length} pending`}
        backHref="/owner"
      />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size="lg" />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon="✅"
            title="All caught up!"
            description="No pending franchise applications."
          />
        ) : (
          visible.map((f) => (
            <ApprovalCard key={f.id} franchise={f} onUpdate={handleUpdate} />
          ))
        )}
      </div>
    </div>
  );
}

