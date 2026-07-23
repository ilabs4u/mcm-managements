'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { API, ROUTES } from '@/lib/constants';
import './auth.css';

/**
 * Login form — authenticates user and routes based on role + franchise status.
 */
export default function LoginForm({ errorParam }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    errorParam === 'rejected' ? 'Your franchise application was rejected.'
    : errorParam === 'suspended' ? 'Your account has been suspended. Contact the owner.'
    : null
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Login failed. Check your credentials.');
        return;
      }

      // Route based on role + franchise status
      const { role, franchise_status } = data.data;
      if (role === 'owner') {
        router.push(ROUTES.OWNER.DASHBOARD);
      } else if (franchise_status === 'approved') {
        router.push(ROUTES.FRANCHISE.TODAY);
      } else if (franchise_status === 'pending') {
        router.push(ROUTES.PENDING);
      } else {
        setError('Unable to determine your account status. Contact the owner.');
      }
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
        <p className="auth-card__brand-tagline">Franchise Management</p>
      </div>

      <h2 className="auth-card__title">Welcome back</h2>
      <p className="auth-card__subtitle">Sign in to your portal</p>

      {error && (
        <div className="auth-card__error animate-fade-in">
          {error}
        </div>
      )}

      <form className="auth-card__form" onSubmit={handleSubmit}>
        <Input
          id="login-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button
          id="login-submit"
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="auth-card__footer">
        New franchise?{' '}
        <Link href={ROUTES.REGISTER} className="auth-card__link">
          Register here
        </Link>
      </p>
    </div>
  );
}
