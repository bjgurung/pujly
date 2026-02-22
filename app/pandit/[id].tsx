import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { MapPin, BadgeCheck, Languages, Clock, MessageSquare, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import Rating from '@/components/Rating';
import ServiceCard from '@/components/ServiceCard';
import Button from '@/components/Button';

export default function PanditDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getPanditById, getServicesByPandit } = useServicesStore();
  const pandit = getPanditById(id || '');
  const panditServices = getServicesByPandit(id || '');

  if (!pandit) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Pandit not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: pandit.name }} />
      <View style={styles.profileSection}>
        <Image source={{ uri: pandit.imageUrl }} style={styles.avatar} contentFit="cover" />
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pandit.name}</Text>
          {pandit.verified && <BadgeCheck size={20} color={colors.primary} />}
        </View>
        <Text style={styles.specialization}>{pandit.specialization}</Text>
        <Rating rating={pandit.rating} reviewCount={pandit.reviewCount} size={14} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{pandit.experience || '10'}+</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{pandit.reviewCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{pandit.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <MapPin size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>{pandit.location}</Text>
        </View>
        {pandit.languages && pandit.languages.length > 0 && (
          <View style={styles.infoItem}>
            <Languages size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{pandit.languages.join(', ')}</Text>
          </View>
        )}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>{pandit.about}</Text>
      </View>

      {panditServices.length > 0 && (
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          {panditServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => router.push(`/service/${service.id}` as any)}
              horizontal
            />
          ))}
        </View>
      )}

      <View style={styles.actionButtons}>
        <Button
          title="Book Now"
          onPress={() => router.push('/booking/create' as any)}
          icon={<Calendar size={18} color={colors.white} />}
          style={styles.bookBtn}
        />
        <Button
          title="Message"
          onPress={() => router.push(`/chat/${pandit.id}` as any)}
          variant="outline"
          icon={<MessageSquare size={18} color={colors.primary} />}
          style={styles.messageBtn}
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundLight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  specialization: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 4,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 0,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  infoSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
  },
  aboutSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  servicesSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  bookBtn: {
    flex: 1,
  },
  messageBtn: {
    flex: 1,
  },
});
