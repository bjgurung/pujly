import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import Button from '@/components/Button';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={56} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items from the store to get started</Text>
        <Button title="Browse Store" onPress={() => router.push('/(tabs)/store' as any)} style={styles.browseBtn} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <View key={item.product.id} style={styles.cartItem}>
            <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} contentFit="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>
                ${(item.product.discountedPrice || item.product.price).toLocaleString()}
              </Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus size={16} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeFromCart(item.product.id)}
                >
                  <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${total.toLocaleString()}</Text>
        </View>
        <Button title="Proceed to Checkout" onPress={() => router.push('/checkout' as any)} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  browseBtn: {
    marginTop: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.backgroundLight,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    gap: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
});
