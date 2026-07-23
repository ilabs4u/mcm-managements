'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { createFranchiseProfile } from '@/app/actions/auth';
import './auth.css';

/**
 * Registration form for new franchise managers.
 * On success → navigates to /pending (awaiting owner approval).
 */
export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    franchise_name: '',
    franchise_location: '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1 & 2 & 3: Server action creates the user (auto-confirmed), profile, and franchise
      const profileResult = await createFranchiseProfile(form);

      if (!profileResult.success) {
        setError(profileResult.error || 'Failed to complete registration.');
        setLoading(false);
        return;
      }

      // Step 4: Sign in the newly created user to establish a session
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (loginError) {
        // Registration worked but login failed
        router.push(ROUTES.LOGIN);
        return;
      }

      // Step 5: Manager sees "Awaiting approval" screen
      router.push(ROUTES.PENDING);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-slide-up">
      <div className="auth-card__brand">
        <h1 className="auth-card__brand-name gradient-text">MCM</h1>
        <p className="auth-card__brand-tagline">Franchise Registration</p>
      </div>

      <h2 className="auth-card__title">Create your account</h2>
      <p className="auth-card__subtitle">Your franchise will be reviewed by the owner</p>

      {error && (
        <div className="auth-card__error animate-fade-in">{error}</div>
      )}

      <form className="auth-card__form" onSubmit={handleSubmit}>
        <Input id="reg-name" label="Full Name" placeholder="Your full name" value={form.full_name} onChange={set('full_name')} required />
        <Input id="reg-email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
        <Input id="reg-password" label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required autoComplete="new-password" />
        <Input id="reg-phone" label="Phone (optional)" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>Franchise Details</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input id="reg-franchise-name" label="Franchise / Outlet Name" placeholder="e.g. MCM Andheri East" value={form.franchise_name} onChange={set('franchise_name')} required />
            <Input id="reg-location" label="Location (optional)" placeholder="e.g. Andheri East, Mumbai" value={form.franchise_location} onChange={set('franchise_location')} />
          </div>
        </div>

        <Button id="reg-submit" type="submit" variant="primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Creating account…' : 'Register Franchise'}
        </Button>
      </form>

      <p className="auth-card__footer">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="auth-card__link">Sign in</Link>
      </p>
    </div>
  );
}
