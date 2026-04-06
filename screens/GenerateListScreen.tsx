import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGenerate } from '../hooks/useGenerate';
import Icon from 'react-native-vector-icons/Ionicons';   // or MaterialIcons, etc.

type ProductItem = {
  sku: string | number;
  name: string;
  image: string;
};

export default function GenerateListScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'fr'>('en');

  const { items, loading, error, generate, clear } = useGenerate();
  const handleGenerate = () => {
      generate(inputText, 'en');
      Keyboard.dismiss();        // Optional: hide keyboard after search
  };

  const clearInput = () => {
    setInputText('');
  };

  const renderItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => router.push({
        pathname: `/detail/${item.sku}`,
        params: {
          lang: selectedLang,
        }
        })
      }
      activeOpacity={0.7}
    >
      {/* Image on the left */}
      <Image
        source={{ uri: item.thumbnailImage }}
        style={styles.itemImage}
        resizeMode="cover"
        // defaultSource={require('../../assets/images/placeholder.jpg')
        onError={(e) => console.log('Image load error for', item.name, e.nativeEvent)}   // ← Very useful!
        // onLoad={() => console.log('Image loaded successfully for', item.name)}
      />

      {/* Name on the right */}
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        {/* You can add more fields here later (price, description, etc.) */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        
        {/* Text Input + Icon inside */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Search Best Buy"
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={handleGenerate}   // Press "Go" on keyboard also triggers
          />
          
          {/* Clickable Clear Icon */}
          {inputText.length > 0 && (
            <TouchableOpacity onPress={clearInput} style={styles.clearIcon}>
              <Icon name="close-circle" size={24} color="#999" />
            </TouchableOpacity>
          )}
        </View>


        {/* Shopping Cart Icon - Clickable */}
      <TouchableOpacity 
        style={styles.cartButton}
        onPress={() => {
          // TODO: Navigate to cart screen or show cart
          router.push('/cart');
          // navigation.navigate('Cart');   // if using React Navigation
        }}
      >
        <Icon name="cart-outline" size={28} color="#007AFF" />
      </TouchableOpacity>

      </View>

      {/* Generated List */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
  gap: 12,                    // Space between input and button
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
  itemImage: {
  width: 80,          // Must have fixed width
  height: 80,         // Must have fixed height
  borderRadius: 8,
  marginRight: 12,
  backgroundColor: '#f0f0f0',   // ← Helps see the box while debugging
  },
  itemContent: {
    flex: 1,                        // ← Very important! Let text take remaining space
    justifyContent: 'center',       // Center text vertically
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,                  // Prevents long text from breaking layout
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    padding: 4,
  },
  cartButton: {
  height: 52,
  width: 52,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

