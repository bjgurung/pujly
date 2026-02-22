import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Package } from '@/mocks/packages';

interface PackageCardProps {
  pkg: Package;
  onPress: () => void;
}

export default function PackageCard({ pkg, onPress }: PackageCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: pkg.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.overlay} />
      {pkg.tag && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{pkg.tag}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{pkg.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{pkg.description}</Text>
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            {pkg.price ? (
              <>
                <Text style={styles.price}>₹{pkg.price.toLocaleString()}</Text>
                {pkg.originalPrice && (
                  <Text style={styles.originalPrice}>₹{pkg.originalPrice.toLocaleString()}</Text>
                )}
              </>
            ) : (
              <Text style={styles.price}>Get Quote</Text>
            )}
          </View>
          {pkg.duration && (
            <View style={styles.durationRow}>
              <Clock size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.durationText}>{pkg.duration}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 14,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  tag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  originalPrice: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'line-through',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
