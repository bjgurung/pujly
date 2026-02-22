import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ShoppingCart, Heart, Truck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { products } from '@/mocks/products';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import Rating from '@/components/Rating';
import Button from '@/components/Button';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} added to your cart`, [
      { text: 'Continue Shopping' },
      { text: 'View Cart', onPress: () => router.push('/cart' as any) },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: product.name }} />
      <Image source={{ uri: product.images[0] }} style={styles.image} contentFit="cover" />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{product.name}</Text>
          <Button
            title=""
            onPress={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
            variant="ghost"
            icon={<Heart size={22} color={wishlisted ? colors.error : colors.textMuted} fill={wishlisted ? colors.error : 'transparent'} />}
            style={styles.wishlistBtn}
          />
        </View>

        <Rating rating={product.rating} reviewCount={product.reviewCount} size={14} />

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{(product.discountedPrice || product.price).toLocaleString()}</Text>
          {product.discountedPrice && (
            <>
              <Text style={styles.originalPrice}>₹{product.price.toLocaleString()}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                </Text>
              </View>
            </>
          )}
        </View>

        {product.deliveryInfo && (
          <View style={styles.deliveryCard}>
            <Truck size={16} color={colors.secondary} />
            <Text style={styles.deliveryText}>{product.deliveryInfo}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {product.details?.contents && product.details.contents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {product.details.contents.map((item, index) => (
              <View key={index} style={styles.contentItem}>
                <View style={styles.dot} />
                <Text style={styles.contentText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            icon={<ShoppingCart size={18} color={colors.white} />}
            size="large"
          />
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  wishlistBtn: {
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  price: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  deliveryText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  contentText: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  actions: {
    marginTop: 24,
  },
});
