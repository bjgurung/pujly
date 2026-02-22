import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export default function Rating({ rating, reviewCount, size = 14, showCount = true }: RatingProps) {
  return (
    <View style={styles.container}>
      <Star size={size} color={colors.gold} fill={colors.gold} />
      <Text style={[styles.rating, { fontSize: size - 1 }]}>{rating.toFixed(1)}</Text>
      {showCount && reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>({reviewCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontWeight: '600',
    color: colors.text,
  },
  count: {
    color: colors.textMuted,
  },
});
