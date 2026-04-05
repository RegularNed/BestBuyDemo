// src/api/client.ts
import { fetch } from 'expo/fetch';   // Recommended in Expo for consistency

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://www.bestbuy.ca';
// const url = new URL('/todos/1', 'https://dummyjson.com/products');
//
// export const apiClient = {
//
//   async search(language: 'en' | 'fr', query: string): Promise<any> {
//
// const response = await fetch(url.toString(), {
//   method: 'GET',
//   headers: { 'Accept': 'application/json' },
// });
//
// if (!response.ok) {
//   throw new Error(`HTTP error! status: ${response.status}`);
// }
//
// const data = await response.json();
// console.log('Test API Success:', data);
// return data;
// }
// };

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

    console.trace('hey am I in this url thing: ', url);
    const response = await fetch(url.toString(), {
      method: 'GET',                    // Most search APIs use GET
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
  console.log('Response status:', response.status, response.statusText);

  // First, always read as text so we can inspect it
  const text = await response.text();

  if (!text || text.trim() === '') {
    throw new Error(`Empty response from server (status ${response.status})`);
  }

  try {
    const data = JSON.parse(text);
    // console.log('actual response body:', data); // Show first 500 chars
    return data;
  } catch (parseError) {
    console.error('Raw response body:', text.substring(0, 500)); // Show first 500 chars
    throw new Error(`Invalid JSON response from server: ${parseError.message}`);
  }
 }
};
