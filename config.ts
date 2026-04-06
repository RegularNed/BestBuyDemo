const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://www.bestbuy.ca',
    timeout: 15000,                    // 15 seconds
  }
} as const;

export default config;
