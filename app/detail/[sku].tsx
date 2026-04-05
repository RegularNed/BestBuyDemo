import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BASE_URL = 'http://www.bestbuy.ca';

type MediaItem = {
  url: string;
  mimeType: string;
};

type ProductDetail = {
  sku: string;
  name: string;
  media: MediaItem[];
  description?: string;
  price?: number;
  // add other fields your detail API returns
};

export default function DetailScreen() {
  const { sku, lang } = useLocalSearchParams<{
    sku: string;
    lang?: 'en' | 'fr';
  }>();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Replace with your actual detail API endpoint
        const url = new URL(`/api/v2/json/product/${sku.trim()}`, BASE_URL);

        url.searchParams.append('lang', lang);        // 'en' or 'fr'i
        
        console.trace('retrieving this product: ', url);
        
        const response = await fetch(url.toString(), {
            method: 'GET',                    // Most search APIs use GET
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          
        const text = await response.text();

        if (!text || text.trim() === '') {
          throw new Error(`Empty response from server (status ${response.status})`);
        }

        try {
          const data = JSON.parse(text);
          const mappedProduct: ProductDetail = {
                sku: data?.sku ?? '',
                name: data?.name ?? '',
                media: Array.isArray(data.additionalMedia) 
                    ? data.additionalMedia.map((item: any) => ({
                        mediaUrlurl: item.url ?? '',
                        mimeType: item.mimeType ?? item.contentType ?? 'Image',
                      }))
                    : [],
                description: data?.shortDescription ?? data?.longDescription ?? '',
                price: data?.salePrice 
                    ? Number(data.salePrice) 
                    : data?.regularPrice 
                      ? Number(data.regularPrice) 
                      : undefined,              
                };
          setProduct(mappedProduct);
          console.log('retrieved:', data);
        } catch (parseError) {
          console.error('Raw response body:', text.substring(0, 500));
          throw new Error(`Invalid JSON response from server: ${parseError.message}`);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (sku) fetchDetail();
  }, [sku]);

    const renderMedia = ({ item }: { item: MediaItem }) => {
    const mime = item.mimeType.toLowerCase();

    if (mime.startsWith('Image')) {
      return (
        <Image
          source={{ uri: item.url }}
          style={styles.mediaItem}
          resizeMode="cover"
        />
      );
    }

    if (mime.startsWith('Video')) {
      return (
        <Video
          source={{ uri: item.url }}
          style={styles.mediaItem}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
      );
    }

    // Fallback
    return (
      <View style={styles.fallback}>
        <Text>Unsupported media</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        {/* Horizontal Media Scroller */}
        <FlatList
          data={product?.media || []}
          keyExtractor={(item, index) => `media-${index}`}
          horizontal
          pagingEnabled                // Makes it snap like a carousel
          showsHorizontalScrollIndicator={false}
          renderItem={renderMedia}
          snapToAlignment="center"
          decelerationRate="fast"
          style={styles.mediaList}
        />

        {/* Optional: Dots indicator */}
        {/* You can add a dot indicator here later */}

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product?.name}</Text>
          {/* price, description, etc. */}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  detailImage: { width: '100%', height: 300 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 20, color: '#007AFF', fontWeight: '600', marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 24, color: '#444' },
  error: { color: 'red', fontSize: 16 },
});
