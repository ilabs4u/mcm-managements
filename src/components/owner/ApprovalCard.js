'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { API } from '@/lib/constants';
import './owner.css';

/**
 * ApprovalCard — shown in /owner/approvals for each pending franchise.
 * Approve or reject with visual feedback.
 */
export default function ApprovalCard({ franchise, onUpdate }) {
  const [loading, setLoading] = useState(null); // 'approved' | 'rejected' | null

  const handleAction = async (status) => {
    setLoading(status);
    try {
      const res = await fetch(`${API.OWNER.FRANCHISES}/${franchise.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) onUpdate(franchise.id, status);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="approval-card animate-fade-in">
      <div className="approval-card__header">
        <div>
          <h3 className="approval-card__name">{franchise.name}</h3>
          {franchise.location && (
            <p className="approval-card__location">📍 {franchise.location}</p>
          )}
        </div>
        <Badge variant="pending">Pending</Badge>
      </div>

      <div className="approval-card__manager">
        <span className="approval-card__manager-label">Manager:</span>
        <span className="approval-card__manager-name">
          {franchise.profiles?.full_name || 'Unknown'}
        </span>
      </div>

      {franchise.profiles?.email && (
        <p className="approval-card__email">{franchise.profiles.email}</p>
      )}

      <div className="approval-card__actions">
        <Button
          id={`approve-${franchise.id}`}
          variant="primary"
          style={{ flex: 1 }}
          disabled={!!loading}
          onClick={() => handleAction('approved')}
        >
          {loading === 'approved' ? 'Approving…' : '✓ Approve'}
        </Button>
        <Button
          id={`reject-${franchise.id}`}
          variant="secondary"
          style={{ flex: 1, color: 'var(--status-error)', borderColor: 'rgba(239,68,68,0.3)' }}
          disabled={!!loading}
          onClick={() => handleAction('rejected')}
        >
          {loading === 'rejected' ? 'Rejecting…' : '✕ Reject'}
        </Button>
      </div>
    </div>
  );
}
