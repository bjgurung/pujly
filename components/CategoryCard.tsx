import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Category } from '@/mocks/categories';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  compact?: boolean;
}

export default function CategoryCard({ category, onPress, compact }: CategoryCardProps) {
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: category.imageUrl }} style={styles.compactImage} contentFit="cover" />
        </View>
        <Text style={styles.compactTitle} numberOfLines={2}>{category.title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: category.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{category.title}</Text>
        {category.description && (
          <Text style={styles.description} numberOfLines={1}>{category.description}</Text>
        )}
        <Text style={styles.count}>{category.count} services</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  count: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  compactCard: {
    alignItems: 'center',
    width: 80,
    marginRight: 16,
  },
  compactImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.backgroundLight,
  },
  compactImage: {
    width: 64,
    height: 64,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginTop: 6,
  },
});
