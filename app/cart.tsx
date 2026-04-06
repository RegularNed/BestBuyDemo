// app/cart.tsx
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCartStore } from '../store/shoppingCart';

export default function CartScreen() {
  const { items, removeItem, increaseQuantity, decreaseQuantity, totalPrice, totalItems } = useCartStore();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.sku)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.sku)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => removeItem(item.sku)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart ({totalItems})</Text>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.sku}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty</Text>}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 4,
  },
  // ... add other styles as needed
});
