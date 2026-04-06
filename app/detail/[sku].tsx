import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, Stack} from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDE_MARGIN = 20;
const ITEM_WIDTH = SCREEN_WIDTH - SIDE_MARGIN * 2;

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

  const addToCart = () => {
    console.log(`added ${product.name} to cart!`)
  };

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
                        url: item.url ?? '',
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
          console.log('retrieved:', mappedProduct);
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

    if (mime.startsWith('image')) {
      return (
        <Image
          source={{ uri: item.url }}
          style={styles.mediaItem}
          resizeMode="cover"
        />
      );
    }

    if (mime.startsWith('video')) {
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}                    // nice iOS overscroll feel
      >
      <View style={styles.container}>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product?.name}</Text>
          {/* price, description, etc. */}
        </View>
        {/* Horizontal Media Scroller */}
        <View style={styles.carouselContainer}>
        <FlatList
          data={product?.media || []}
          keyExtractor={(item, index) => `media-${index}`}
          horizontal
          pagingEnabled                // Makes it snap like a carousel
          snapToInterval={ITEM_WIDTH}
          showsHorizontalScrollIndicator={false}
          renderItem={renderMedia}
          snapToAlignment="center"
          decelerationRate="fast"
        />
        </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          {`\$${product?.price}`}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>
          {product?.description || 'No description available.'}
        </Text>
      </View>

      </View>

      <View style={styles.infoContainer}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={addToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      </View>

    </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaList: {
    height: 380,                    // Adjust height as needed
  },
  carouselContainer: {
    paddingHorizontal: SIDE_MARGIN,   // This creates the margin on left & right
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,                  // Prevents long text from breaking layout
  },
  itemContent: {
    flex: 1,                        // ← Very important! Let text take remaining space
    justifyContent: 'center',       // Center text vertically
  },
  mediaItem: {
    width: ITEM_WIDTH,            // Full screen width per item
    height: 380,
    backgroundColor: '#000',
  },
  fallback: {
    width: ITEM_WIDTH,
    height: 380,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemContainer: {
  flexDirection: 'row',           // Keep this
  alignItems: 'center',           // ← This is the key fix!
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
});
