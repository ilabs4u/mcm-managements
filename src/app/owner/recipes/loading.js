import React from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function RecipesLoading() {
  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '6rem' }}>
      <div>
        <Skeleton width="150px" height="32px" style={{ marginBottom: '8px' }} />
        <Skeleton width="220px" height="20px" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[1, 2].map((i) => (
          <Card key={i} elevated style={{ overflow: 'hidden', padding: 0 }}>
            {/* Header Image Skeleton */}
            <Skeleton width="100%" height="180px" borderRadius="0" />
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <Skeleton width="160px" height="28px" style={{ marginBottom: '8px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Skeleton width="60px" height="24px" borderRadius="12px" />
                    <Skeleton width="80px" height="16px" />
                  </div>
                </div>
              </div>

              <div>
                <Skeleton width="120px" height="20px" style={{ marginBottom: '1rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Skeleton width="6px" height="6px" borderRadius="50%" />
                        <Skeleton width="100px" height="16px" />
                      </div>
                      <Skeleton width="50px" height="16px" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
