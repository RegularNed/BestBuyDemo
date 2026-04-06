// src/api/client.ts
import { fetch } from 'expo/fetch';   // Recommended in Expo for consistency
import config from '../config';

export const apiClient = {
 async search(language: 'en' | 'fr', query: string): Promise<any> {
    if (!query.trim()) {
      throw new Error('Query cannot be empty');
    }

    // Build the URL with query parameters cleanly
    const url = new URL('/api/v2/json/search', config.api.baseUrl);   // ← Change '/search' to your actual endpoint path

    // Add the two required fields as query parameters
    url.searchParams.append('lang', language);
    url.searchParams.append('query', query.trim());

    const response = await fetch(url.toString(), {
      method: 'GET',                    // Most search APIs use GET
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache',
      },
    });
    
  // First, always read as text so we can inspect it
  const text = await response.text();

  if (!text || text.trim() === '') {
    throw new Error(`Empty response from server (status ${response.status})`);
  }

  try {
    const data = JSON.parse(text);
    return data;
  } catch (parseError) {
    console.error('Raw response body:', text.substring(0, 500)); // Show first 500 chars
    throw new Error(`Invalid JSON response from server: ${parseError.message}`);
  }
 }
};
