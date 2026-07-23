'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function RecipesPage() {
  const recipes = [
    { 
      name: 'Dum Biryani', 
      packetSize: '3 kg',
      image: '/brand/dum-biryani.png',
      thumbnail: '/brand/IMG_0158.jpeg',
      ingredients: [
        { name: 'Rice', qty: '4 kg' },
        { name: 'Berista', qty: '500 gm' },
        { name: 'Dum Masala', qty: '1 pkt' }
      ]
    },
    { 
      name: 'Tandoori Biryani', 
      packetSize: '3 kg',
      image: '/brand/tandoori-biryani.png',
      thumbnail: '/brand/IMG_0637.jpeg',
      ingredients: [
        { name: 'Rice', qty: '4 kg' },
        { name: 'Berista', qty: '500 gm' },
        { name: 'Tandoori Masala', qty: '1 pkt' }
      ]
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Recipes</h1>
        <Link href="/owner/recipes/edit">
          <Button variant="primary" style={{ padding: '0.5rem 1rem', width: 'auto' }}>+ New</Button>
        </Link>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recipes.map((r, i) => (
          <Card key={i} elevated className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '180px', position: 'relative', width: '100%' }}>
              <Image src={r.image} alt={r.name} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.1) 70%)' }}></div>
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{r.name}</h3>
                  <p style={{ color: 'var(--brand-primary)', fontSize: '0.875rem', fontWeight: '500' }}>Packet Size: {r.packetSize}</p>
                </div>
                <Link href="/owner/recipes/edit">
                  <Button variant="primary" style={{ padding: '0.4rem 1.2rem', width: 'auto', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Edit</Button>
                </Link>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Ingredients per packet</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {r.ingredients.map((ing, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: j < r.ingredients.length - 1 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: j < r.ingredients.length - 1 ? '0.5rem' : 0 }}>
                    <span style={{ fontWeight: '500' }}>{ing.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{ing.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
