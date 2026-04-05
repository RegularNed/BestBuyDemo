import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from 'react-native';

import { useGenerate } from '../hooks/useGenerate';
import Icon from 'react-native-vector-icons/Ionicons';   // or MaterialIcons, etc.

export default function GenerateListScreen() {
  const [inputText, setInputText] = useState('');
  const [itemList, setItems] = useState<string[]>([]);
  const { items, loading, error, generate, clear } = useGenerate();
  const handleGenerate = () => {

      console.log('hey Fetching');
      generate('ipad', 'en');
      console.log('hey Fetched:', items);
    // Simulate generating a list based on input
    const newItems = [
      `${inputText} - Item 1`,
      `${inputText} - Item 2`,
      `${inputText} - Item 3`,
      `${inputText} - Item 4`,
    ];

    setItems(newItems);
    Keyboard.dismiss();        // Optional: hide keyboard after search
  };

  const clearInput = () => {
    setInputText('');
    setItems([]);              // Optional: clear list when input is cleared
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item}</Text>
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
      {itemList.length > 0 && (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Empty state */}
      {itemList.length === 0 && inputText.length > 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Press Generate to create list</Text>
        </View>
      )}
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

