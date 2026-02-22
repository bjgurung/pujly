import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { products, productCategories, featuredProducts, newArrivals } from '@/mocks/products';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import ProductCard from '@/components/ProductCard';
import { Image } from 'expo-image';

export default function StoreScreen() {
  const router = useRouter();
  const cartCount = useCartStore((s) => s.getCartCount());
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Store</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push('/(tabs)/search' as any)}
            >
              <Search size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart' as any)}>
              <ShoppingCart size={22} color={colors.text} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          <TouchableOpacity
            style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {productCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!selectedCategory && featuredProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <FlatList
              horizontal
              data={featuredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/product/${item.id}` as any)}
                  onWishlist={() =>
                    isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)
                  }
                  isWishlisted={isInWishlist(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {!selectedCategory && newArrivals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <FlatList
              horizontal
              data={newArrivals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/product/${item.id}` as any)}
                  onWishlist={() =>
                    isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)
                  }
                  isWishlisted={isInWishlist(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? productCategories.find((c) => c.id === selectedCategory)?.name || 'Products'
              : 'All Products'}
          </Text>
          <View style={styles.productsGrid}>
            {displayProducts.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard
                  product={product}
                  onPress={() => router.push(`/product/${product.id}` as any)}
                  onWishlist={() =>
                    isInWishlist(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  isWishlisted={isInWishlist(product.id)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeTop: {
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  scrollContent: {
    paddingTop: 8,
  },
  categoriesRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
  },
});
