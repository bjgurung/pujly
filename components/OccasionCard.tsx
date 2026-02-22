import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';

interface OccasionCardProps {
  occasion: {
    id: string;
    name: string;
    image: string;
  };
  onPress: () => void;
}

export default function OccasionCard({ occasion, onPress }: OccasionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: occasion.image }} style={styles.image} contentFit="cover" />
      <Text style={styles.name}>{occasion.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: 90,
    marginRight: 14,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.backgroundLight,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginTop: 6,
  },
});
