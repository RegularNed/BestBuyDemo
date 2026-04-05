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
    
    console.log('hey in useGenerate');

    try {
      const data = await apiClient.search(language, inputText);

      // Adjust according to your actual API response shape
      setItems(data.items || data.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to generate items');
      console.error(err);
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
