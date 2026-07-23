'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { updateProfile } from '@/app/actions/settings';

export default function SettingsClient({ profile }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const res = await updateProfile(profile.id, formData);
    if (res.success) {
      setMessage('Profile updated successfully!');
      router.refresh();
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      <PageHeader 
        title="Settings" 
        subtitle="Manage your profile"
        right={<button className="logout-link" onClick={() => router.back()}>Back</button>}
      />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <Card elevated className="glass-panel" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Profile Picture</label>
              <ImageUpload
                bucket="uploads"
                pathPrefix="avatars"
                currentImage={formData.avatar_url}
                onUpload={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
              />
            </div>

            <Input 
              label="Full Name" 
              value={formData.full_name} 
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              required 
            />
            
            <Input 
              label="Phone Number" 
              value={formData.phone} 
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
            />

            {message && <div style={{ color: 'var(--status-success)', fontSize: '0.875rem' }}>{message}</div>}
            {error && <div style={{ color: 'var(--status-error)', fontSize: '0.875rem' }}>{error}</div>}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
