import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Rating from './Rating';
import { Product } from '@/mocks/products';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onPress, onWishlist, isWishlisted }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.image} contentFit="cover" />
        {product.discountedPrice && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
            </Text>
          </View>
        )}
        {product.isNew && (
          <View style={[styles.badge, styles.newBadge]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        {onWishlist && (
          <TouchableOpacity style={styles.wishlistBtn} onPress={onWishlist}>
            <Heart
              size={18}
              color={isWishlisted ? colors.error : colors.textMuted}
              fill={isWishlisted ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Rating rating={product.rating} reviewCount={product.reviewCount} size={11} />
        <View style={styles.priceRow}>
          <Text style={styles.price}>${(product.discountedPrice || product.price).toLocaleString()}</Text>
          {product.discountedPrice && (
            <Text style={styles.originalPrice}>${product.price.toLocaleString()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 165,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadge: {
    backgroundColor: colors.secondary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
