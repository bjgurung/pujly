import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Clock, MapPin, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import Rating from '@/components/Rating';
import Button from '@/components/Button';
import PanditCard from '@/components/PanditCard';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getServiceById, getPanditById } = useServicesStore();
  const service = getServiceById(id || '');
  const pandit = service ? getPanditById(service.panditId) : undefined;

  if (!service) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: service.title }} />
      <Image source={{ uri: service.imageUrl }} style={styles.heroImage} contentFit="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{service.title}</Text>
        <Rating rating={service.rating} reviewCount={service.reviewCount} size={14} />

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{service.duration} minutes</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{service.location}</Text>
          </View>
        </View>

        {service.price && (
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>${service.price.toLocaleString()}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Service</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        {pandit && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performed by</Text>
            <PanditCard pandit={pandit} onPress={() => router.push(`/pandit/${pandit.id}` as any)} />
          </View>
        )}

        <Button
          title="Book Now"
          onPress={() => router.push('/booking/create' as any)}
          icon={<Calendar size={18} color={colors.white} />}
          size="large"
          style={styles.bookBtn}
        />
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
  notFoundText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.textLight,
  },
  priceCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
  },
  bookBtn: {
    marginTop: 24,
  },
});
