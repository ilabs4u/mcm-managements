'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { API } from '@/lib/constants';

export default function FranchiseDetailsPage({ params }) {
  const router = useRouter();
  const id = React.use(params).id;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API.OWNER.FRANCHISES}/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading franchise details...</div>;
  }

  if (error || !data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--status-error)', marginBottom: '1rem' }}>{error}</p>
        <button onClick={() => router.back()} style={{ padding: '0.5rem 1rem', background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const { franchise, manager, logs } = data;
  
  // Calculate this month's consumption
  const totals = {};
  logs.forEach(log => {
    if (log.daily_log_items) {
      log.daily_log_items.forEach(item => {
        if (item.material_breakdown && item.material_breakdown.ingredients) {
          item.material_breakdown.ingredients.forEach(ing => {
            if (!totals[ing.name]) {
              totals[ing.name] = { quantity: 0, unit: ing.unit };
            }
            totals[ing.name].quantity += ing.quantity;
          });
        }
      });
    }
  });

  const recentLogs = logs.slice(0, 5).map(log => {
    let totalQty = 0;
    let riceQty = 0;
    
    if (log.daily_log_items) {
      log.daily_log_items.forEach(item => {
        totalQty += item.quantity_kg || 0;
        if (item.material_breakdown && item.material_breakdown.ingredients) {
          const rice = item.material_breakdown.ingredients.find(i => i.name.toLowerCase().includes('rice'));
          if (rice) riceQty += rice.quantity;
        }
      });
    }
    
    return {
      date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      qty: totalQty.toFixed(1) + ' kg',
      rice: riceQty.toFixed(1) + ' kg'
    };
  });

  return (
    <div className="animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem' }}
        >
          &larr;
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{franchise.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manager: {manager?.full_name || 'Unknown'} {franchise.location ? `| ${franchise.location}` : ''}
          </p>
        </div>
      </header>

      {/* Monthly Summary */}
      <Card elevated className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: '600' }}>This Month's Consumption</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.keys(totals).length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>No production data for this month.</div>
          ) : (
            Object.entries(totals).map(([name, { quantity, unit }], index, arr) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: index < arr.length - 1 ? '1px dashed var(--border-subtle)' : 'none', paddingBottom: index < arr.length - 1 ? '0.5rem' : '0' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{name} Used</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: name.toLowerCase().includes('rice') ? 'var(--brand-primary)' : name.toLowerCase().includes('berista') ? '#facc15' : 'var(--text-primary)' }}>
                    {quantity.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{unit}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent History */}
      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Daily Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentLogs.length === 0 ? (
            <Card style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recent logs found.
            </Card>
          ) : (
            recentLogs.map((log, i) => (
              <Card key={i} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{log.date}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rice consumed: {log.rice}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: 'var(--brand-primary)' }}>{log.qty}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Prod.</div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

