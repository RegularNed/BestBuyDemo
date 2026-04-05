import { useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export function useGenerate() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (inputText: string, language: 'en' | 'fr' = 'en') => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    
try {
      // ← This is where we call apiClient.search
      const data = await apiClient.search(language, inputText);
      const productsArray = data?.products ?? [];        // Safe access

    if (!Array.isArray(productsArray)) {
      console.warn('API did not return "products" as an array:', data);
      setItems([]);
      return;
    }
      setItems(productsArray || []);

    } catch (err: any) {
      setError(err.message || 'Failed to generate results. Please try again.');
      console.error('API Error');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setError(null);
  }, []);

  return { items, loading, error, generate, clear };
}
