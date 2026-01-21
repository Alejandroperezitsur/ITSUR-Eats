import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '@redux/hooks';
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from '@redux/productSlice';

export function CartScreen(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.products);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      dispatch(updateCartQuantity({ productId, quantity }));
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items before checkout');
      return;
    }
    Alert.alert('Checkout', `Total: $${cart.total.toFixed(2)}\n\nProceed to payment?`);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>${item.product.price} each</Text>
      </View>

      <View style={styles.quantityControl}>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
        >
          <Text style={styles.quantityButton}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
        >
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtotal}>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</Text>

      <TouchableOpacity onPress={() => handleRemoveItem(item.product.id)}>
        <Text style={styles.removeButton}>×</Text>
      </TouchableOpacity>
    </View>
  );

  if (cart.items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add some delicious items!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>

      <FlatList
        data={cart.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id}
        scrollEnabled={false}
      />

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${cart.total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          Alert.alert('Clear Cart', 'Are you sure?', [
            { text: 'Cancel' },
            { text: 'Clear', onPress: () => dispatch(clearCart()) },
          ]);
        }}
      >
        <Text style={styles.clearButtonText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  removeButton: {
    fontSize: 24,
    color: '#d32f2f',
    marginLeft: 10,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  checkoutButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
  },
});
