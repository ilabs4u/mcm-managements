'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/components/layout/layout.css';

export default function OwnerLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/owner', label: 'Overview', icon: '📊' },
    { href: '/owner/franchises', label: 'Outlets', icon: '🏪' },
    { href: '/owner/approvals', label: 'Approvals', icon: '✅' },
    { href: '/owner/recipes', label: 'Recipes', icon: '⚙️' },
    { href: '/owner/reports', label: 'Reports', icon: '📅' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="app-layout">
      <nav className="app-sidebar">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            id={`nav-owner-${label.toLowerCase()}`}
            className={`nav-item ${isActive(href) ? 'active' : ''}`}
          >
            <span className="nav-item__icon">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="app-main-content">
        {children}
      </div>
    </div>
  );
}

