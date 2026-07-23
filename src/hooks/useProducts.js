import { useState, useEffect } from 'react';
import { API } from '@/lib/constants';

/**
 * Hook for fetching products with their recipe ingredients.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes, ingRes] = await Promise.all([
        fetch(API.PRODUCTS),
        fetch(API.INGREDIENTS),
      ]);
      const [prodData, ingData] = await Promise.all([prodRes.json(), ingRes.json()]);
      if (prodData.success) setProducts(prodData.data.products);
      if (ingData.success) setIngredients(ingData.data.ingredients);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { products, ingredients, loading, error, reload: load };
}
