import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import ServiceCard from '@/components/ServiceCard';
import PanditCard from '@/components/PanditCard';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCategoryById, getServicesByCategory, getPanditsByCategory } = useServicesStore();
  const category = getCategoryById(id || '');
  const services = getServicesByCategory(id || '');
  const pandits = getPanditsByCategory(id || '');

  if (!category) {
    return (
      <View style={styles.notFound}>
        <Text>Category not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: category.title }} />

      <View style={styles.header}>
        <Text style={styles.title}>{category.title}</Text>
        {category.description && <Text style={styles.description}>{category.description}</Text>}
      </View>

      {services.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => router.push(`/service/${service.id}` as any)}
              horizontal
            />
          ))}
        </View>
      )}

      {pandits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pandits</Text>
          {pandits.map((pandit) => (
            <PanditCard
              key={pandit.id}
              pandit={pandit}
              onPress={() => router.push(`/pandit/${pandit.id}` as any)}
            />
          ))}
        </View>
      )}

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
  header: {
    backgroundColor: colors.white,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 6,
    lineHeight: 22,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
});
