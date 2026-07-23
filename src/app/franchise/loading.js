import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function FranchiseLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '5rem' }}>
      {/* Hero Header Skeleton */}
      <div style={{ padding: '2.5rem 1.5rem 1.5rem 1.5rem', background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Skeleton width="160px" height="32px" style={{ marginBottom: '8px' }} />
          <Skeleton width="120px" height="20px" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
          <Skeleton width="50px" height="20px" />
        </div>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Card elevated className="glass-panel" style={{ borderTop: '4px solid var(--border-subtle)' }}>
          <Skeleton width="140px" height="24px" style={{ marginBottom: '1rem' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Skeleton width="100px" height="16px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="100%" height="45px" borderRadius="var(--radius-md)" />
            </div>
            
            <div>
              <Skeleton width="150px" height="16px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="100%" height="45px" borderRadius="var(--radius-md)" />
            </div>

            <Skeleton width="100%" height="48px" borderRadius="var(--radius-md)" style={{ marginTop: '0.5rem' }} />
          </div>
        </Card>

        <div>
          <Skeleton width="180px" height="24px" style={{ marginBottom: '1rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2].map((i) => (
              <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <div>
                  <Skeleton width="130px" height="20px" style={{ marginBottom: '4px' }} />
                  <Skeleton width="70px" height="16px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Skeleton width="60px" height="20px" style={{ marginBottom: '4px' }} />
                  <Skeleton width="40px" height="16px" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
