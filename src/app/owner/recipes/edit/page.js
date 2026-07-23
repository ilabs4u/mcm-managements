'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';

export default function EditRecipePage() {
  const router = useRouter();
  
  const [productImage, setProductImage] = useState('');
  const [productName, setProductName] = useState('');
  const [packetSize, setPacketSize] = useState('');
  
  // State for dynamic ingredients list
  const [ingredients, setIngredients] = useState([
    { name: '', qty: '', image: '' }
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', qty: '', image: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Normally would save to DB here
    router.push('/owner/recipes');
  };

  return (
    <div className="animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem' }}
        >
          &larr;
        </button>
        <h1 style={{ fontSize: '1.5rem' }}>Configure Recipe</h1>
      </header>

      <Card elevated className="glass-panel" style={{ padding: '1.5rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSave}>
          
          {/* Basic Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--brand-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Product Info</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Product Image (Food)</label>
              <ImageUpload
                bucket="uploads"
                pathPrefix="products"
                currentImage={productImage}
                onUpload={(url) => setProductImage(url)}
              />
            </div>

            <Input 
              label="Product Name" 
              placeholder="e.g. Chicken Tikka" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required 
            />
            <Input 
              label="Packet Size (kg)" 
              type="number" 
              step="0.1" 
              placeholder="e.g. 2" 
              value={packetSize}
              onChange={(e) => setPacketSize(e.target.value)}
              required 
            />
          </div>
          
          {/* Ingredients Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1rem', color: 'var(--brand-primary)' }}>Ingredients & Masala</h2>
              <button 
                type="button" 
                onClick={addIngredient}
                style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '500' }}
              >
                + Add Ingredient
              </button>
            </div>
            
            {ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ingredient #{idx + 1}</label>
                  <button 
                    type="button" 
                    onClick={() => removeIngredient(idx)}
                    disabled={ingredients.length === 1}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: ingredients.length === 1 ? 'var(--text-muted)' : 'var(--status-error)', 
                      fontSize: '0.875rem',
                      cursor: ingredients.length === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Masala / Ingredient Image</label>
                  <ImageUpload 
                    bucket="uploads" 
                    pathPrefix="masala" 
                    currentImage={ing.image} 
                    onUpload={(url) => {
                      const newIngs = [...ingredients];
                      newIngs[idx].image = url;
                      setIngredients(newIngs);
                    }} 
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 2 }}>
                    <Input 
                      placeholder="e.g. Rice" 
                      value={ing.name}
                      onChange={(e) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].name = e.target.value;
                        setIngredients(newIngs);
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input 
                      placeholder="e.g. 4 kg" 
                      value={ing.qty}
                      onChange={(e) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].qty = e.target.value;
                        setIngredients(newIngs);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" type="button" onClick={() => router.back()} style={{ flex: 1 }}>Cancel</Button>
            <Button variant="primary" type="submit" style={{ flex: 2 }}>Save Recipe</Button>
          </div>
          
        </form>
      </Card>
    </div>
  );
}

