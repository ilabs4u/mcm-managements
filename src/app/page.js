import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex-center animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>MCM</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Biryani Franchise Management</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <Link href="/login" style={{ width: '100%' }}>
          <Button variant="primary">Login to Portal</Button>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/owner" style={{ flex: 1 }}>
            <Button variant="secondary">View as Owner</Button>
          </Link>
          <Link href="/franchise" style={{ flex: 1 }}>
            <Button variant="secondary">View as Franchise</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

