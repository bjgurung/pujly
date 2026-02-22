import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { products, productCategories } from '@/mocks/products';
import { useWishlistStore } from '@/store/wishlist-store';
import ProductCard from '@/components/ProductCard';

export default function StoreCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const category = productCategories.find((c) => c.id === id);
  const categoryProducts = products.filter((p) => p.category === id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: category?.name || 'Category' }} />
      {category && (
        <View style={styles.header}>
          <Text style={styles.title}>{category.name}</Text>
          <Text style={styles.description}>{category.description}</Text>
        </View>
      )}
      <View style={styles.grid}>
        {categoryProducts.map((product) => (
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
      {categoryProducts.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No products in this category</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  description: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 16, color: colors.textMuted },
});
