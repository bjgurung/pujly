import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { products } from '@/mocks/products';
import { useWishlistStore } from '@/store/wishlist-store';
import ProductCard from '@/components/ProductCard';

export default function AllProductsScreen() {
  const router = useRouter();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.grid}>
        {products.map((product) => (
          <View key={product.id} style={styles.gridItem}>
            <ProductCard
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
              onWishlist={() =>
                isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)
              }
              isWishlisted={isInWishlist(product.id)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
});
