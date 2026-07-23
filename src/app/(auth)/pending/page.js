'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { API, ROUTES } from '@/lib/constants';
import '@/components/auth/auth.css';

/**
 * Pending approval page — shown to managers who registered but haven't been approved yet.
 */
export default function PendingPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(API.AUTH.LOGOUT, { method: 'POST' });
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="auth-card animate-slide-up" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
      <h1 className="auth-card__brand-name gradient-text" style={{ fontSize: '1.75rem' }}>
        Application Submitted
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
        Your franchise registration is under review by the MCM owner.
        You&apos;ll be able to access the portal once approved.
      </p>

      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-4)',
        textAlign: 'left',
        marginTop: 'var(--spacing-4)',
      }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>
          What happens next?
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            '📋 Owner reviews your franchise details',
            '✅ On approval, your account is activated',
            '📱 You can then log daily production entries',
          ].map((step, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{step}</li>
          ))}
        </ul>
      </div>

      <Button
        variant="ghost"
        style={{ marginTop: 'var(--spacing-4)', color: 'var(--status-error)' }}
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    </div>
  );
}

