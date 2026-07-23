import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function OwnerLoading() {
  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Skeleton width="120px" height="30px" style={{ marginBottom: '8px' }} />
          <Skeleton width="150px" height="20px" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
          <Skeleton width="50px" height="20px" />
        </div>
      </header>

      {/* Brand Hero Banner Skeleton */}
      <Skeleton width="100%" height="160px" borderRadius="var(--radius-lg)" />

      {/* Aggregate Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <Card elevated className="glass-panel" style={{ padding: '1.25rem' }}>
          <Skeleton width="120px" height="20px" style={{ marginBottom: '0.5rem' }} />
          <Skeleton width="80px" height="35px" />
        </Card>
        <Card elevated className="glass-panel" style={{ padding: '1.25rem' }}>
          <Skeleton width="100px" height="20px" style={{ marginBottom: '0.5rem' }} />
          <Skeleton width="70px" height="35px" />
        </Card>
      </div>

      <Card style={{ padding: '1.25rem', background: 'linear-gradient(45deg, var(--bg-surface-elevated), var(--bg-surface))' }}>
        <Skeleton width="150px" height="24px" style={{ marginBottom: '1rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <Skeleton width="90px" height="20px" />
              <Skeleton width="50px" height="20px" />
            </div>
            <Skeleton width="100%" height="6px" borderRadius="3px" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <Skeleton width="120px" height="20px" />
              <Skeleton width="40px" height="20px" />
            </div>
            <Skeleton width="100%" height="6px" borderRadius="3px" />
          </div>
        </div>
      </Card>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Skeleton width="130px" height="25px" />
          <Skeleton width="60px" height="20px" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Skeleton width="8px" height="8px" borderRadius="50%" />
                <div>
                  <Skeleton width="100px" height="20px" style={{ marginBottom: '4px' }} />
                  <Skeleton width="80px" height="15px" />
                </div>
              </div>
              <Skeleton width="60px" height="24px" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
