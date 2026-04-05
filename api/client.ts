// src/api/client.ts
import { fetch } from 'expo/fetch';   // Recommended in Expo for consistency

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://www.bestbuy.ca';

export const apiClient = {
 async search(language: 'en' | 'fr', query: string): Promise<any> {
    if (!query.trim()) {
      throw new Error('Query cannot be empty');
    }

    // Build the URL with query parameters cleanly
    const url = new URL('/api/v2/json/search', BASE_URL);   // ← Change '/search' to your actual endpoint path

    // Add the two required fields as query parameters
    url.searchParams.append('lang', language);
    url.searchParams.append('query', query.trim());

    const response = await fetch(url.toString(), {
      method: 'GET',                    // Most search APIs use GET
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${response.status} ${errorText}`);
    }

    return response.json();
  },
};
