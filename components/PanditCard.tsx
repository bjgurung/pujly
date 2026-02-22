import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MapPin, BadgeCheck, Languages } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Avatar from './Avatar';
import Rating from './Rating';

interface PanditCardProps {
  pandit: {
    id: string;
    name: string;
    imageUrl?: string;
    specialization: string;
    location: string;
    languages?: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
  onPress: () => void;
}

export default function PanditCard({ pandit, onPress }: PanditCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Avatar uri={pandit.imageUrl} name={pandit.name} size={56} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{pandit.name}</Text>
          {pandit.verified && <BadgeCheck size={16} color={colors.primary} />}
        </View>
        <Text style={styles.specialization} numberOfLines={1}>{pandit.specialization}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{pandit.location}</Text>
          </View>
          {pandit.languages && pandit.languages.length > 0 && (
            <View style={styles.metaItem}>
              <Languages size={12} color={colors.textMuted} />
              <Text style={styles.metaText}>{pandit.languages.slice(0, 2).join(', ')}</Text>
            </View>
          )}
        </View>
        <Rating rating={pandit.rating} reviewCount={pandit.reviewCount} size={12} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  specialization: {
    fontSize: 13,
    color: colors.textLight,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
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
});
