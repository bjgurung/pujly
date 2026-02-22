import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Clock, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Rating from './Rating';
import { Service } from '@/mocks/services';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
  horizontal?: boolean;
}

export default function ServiceCard({ service, onPress, horizontal }: ServiceCardProps) {
  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: service.imageUrl }} style={styles.horizontalImage} contentFit="cover" />
        <View style={styles.horizontalContent}>
          <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color={colors.textMuted} />
              <Text style={styles.metaText}>{service.duration} min</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={12} color={colors.textMuted} />
              <Text style={styles.metaText}>{service.location}</Text>
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Rating rating={service.rating} reviewCount={service.reviewCount} size={12} />
            {service.price && (
              <Text style={styles.price}>₹{service.price.toLocaleString()}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: service.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
        <View style={styles.metaRow}>
          <Clock size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{service.duration} min</Text>
        </View>
        <View style={styles.bottomRow}>
          <Rating rating={service.rating} size={12} showCount={false} />
          {service.price && (
            <Text style={styles.price}>₹{service.price.toLocaleString()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
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
  image: {
    width: '100%',
    height: 110,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  horizontalImage: {
    width: 110,
    height: 120,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
});
