import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from 'react-native';

import { useGenerate } from '../hooks/useGenerate';
import Icon from 'react-native-vector-icons/Ionicons';   // or MaterialIcons, etc.

type ProductItem = {
  id: string | number;
  name: string;           // or title
  image: string;          // URL to the image
  // Add other fields you need (price, description, etc.)
};

export default function GenerateListScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'fr'>('en');

  const { items, loading, error, generate, clear } = useGenerate();
  const handleGenerate = () => {

      console.log('hey Fetching');
      generate('RAM', 'en');
      console.log('hey Fetched:', items);
      Keyboard.dismiss();        // Optional: hide keyboard after search
  };

  const clearInput = () => {
    setInputText('');
    setItems([]);              // Optional: clear list when input is cleared
  };

  const renderItem = ({ item }: { item: ProductItem }) => (
    <View style={styles.itemContainer}>
      {/* Image on the left */}
      <Image
        source={{ uri: item.thumbnailImage }}
        style={styles.itemImage}
        resizeMode="cover"
        // defaultSource={require('../../assets/images/placeholder.jpg')
        onError={(e) => console.log('Image load error for', item.name, e.nativeEvent)}   // ← Very useful!
        onLoad={() => console.log('Image loaded successfully for', item.name)}
      />

      {/* Name on the right */}
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        {/* You can add more fields here later (price, description, etc.) */}
      </View>
    </View>
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
            placeholder="Enter something..."
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

        {/* Generate Button */}
        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate</Text>
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
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
  width: 80,          // Must have fixed width
  height: 80,         // Must have fixed height
  borderRadius: 8,
  marginRight: 12,
  backgroundColor: '#f0f0f0',   // ← Helps see the box while debugging
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
  button: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

