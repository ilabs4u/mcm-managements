import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../ui/ui.css';
import './layout.css';

/**
 * Reusable page header for all portal pages.
 * Shows title, subtitle, and an optional right slot (avatar, logout button, etc.)
 */
export function PageHeader({ title, subtitle, right, backHref }) {
  return (
    <header className="page-header">
      <div className="page-header__left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Image src="/logo.jpeg" alt="MCM Logo" width={40} height={40} style={{ borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {backHref && (
            <Link href={backHref} className="page-header__back">
              ←
            </Link>
          )}
          <div>
            <h1 className="page-header__title">{title}</h1>
            {subtitle && (
              <p className="page-header__subtitle">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      {right && (
        <div className="page-header__right">{right}</div>
      )}
    </header>
  );
}
