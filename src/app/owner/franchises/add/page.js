'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AddFranchisePage() {
  const router = useRouter();

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save and go back
    router.push('/owner/franchises');
  };

  return (
    <div className="animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem' }}
        >
          &larr;
        </button>
        <h1 style={{ fontSize: '1.5rem' }}>Add New Outlet</h1>
      </header>

      <Card elevated className="glass-panel" style={{ padding: '1.5rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--brand-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Outlet Details</h2>
            <Input label="Location Name" placeholder="e.g. Malad West" required />
            <Input label="Address" placeholder="Full street address" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--brand-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Manager Account</h2>
            <Input label="Manager Name" placeholder="e.g. John Doe" required />
            <Input label="Manager Email" type="email" placeholder="john@mcm.com" required />
            <Input label="Temporary Password" type="password" placeholder="••••••••" required />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" type="button" onClick={() => router.back()} style={{ flex: 1 }}>Cancel</Button>
            <Button variant="primary" type="submit" style={{ flex: 2 }}>Create Outlet</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

