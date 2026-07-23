'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FranchiseLayout({ children }) {
  const pathname = usePathname();

  const getNavColor = (path) => {
    return pathname === path ? 'var(--brand-primary)' : 'var(--text-secondary)';
  };

  const getNavWeight = (path) => {
    return pathname === path ? '600' : '400';
  };

  return (
    <div className="app-layout">
      <nav className="app-sidebar">
        <Link href="/franchise" className={`nav-item ${pathname === '/franchise' ? 'active' : ''}`}>
          <span className="nav-item__icon">+</span>
          Entry
        </Link>
        <Link href="/franchise/history" className={`nav-item ${pathname === '/franchise/history' ? 'active' : ''}`}>
          <span className="nav-item__icon">⏱</span>
          History
        </Link>
      </nav>

      <div className="app-main-content">
        {children}
      </div>
    </div>
  );
}

