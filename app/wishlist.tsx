import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWishlistStore } from '@/store/wishlist-store';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

export default function WishlistScreen() {
  const router = useRouter();
  const { items, removeFromWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Heart size={56} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptyText}>Items you love will appear here</Text>
        <Button title="Browse Store" onPress={() => router.push('/(tabs)/store' as any)} style={styles.browseBtn} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.grid}>
        {items.map((product) => (
          <View key={product.id} style={styles.gridItem}>
            <ProductCard
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
              onWishlist={() => removeFromWishlist(product.id)}
              isWishlisted={true}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  browseBtn: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
  },
});
