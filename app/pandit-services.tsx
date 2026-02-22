import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Edit2, Clock, IndianRupee } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import Button from '@/components/Button';

export default function PanditServicesScreen() {
  const router = useRouter();
  const { services } = useServicesStore();
  const myServices = services.slice(0, 4);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {myServices.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptyText}>Add your first service to start receiving bookings</Text>
          </View>
        ) : (
          myServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => router.push({ pathname: '/pandit-service-edit' as any, params: { id: service.id } })}
              activeOpacity={0.7}
            >
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Edit2 size={16} color={colors.textMuted} />
              </View>
              <Text style={styles.serviceDescription} numberOfLines={2}>{service.description}</Text>
              <View style={styles.serviceMeta}>
                <View style={styles.metaItem}>
                  <IndianRupee size={13} color={colors.primary} />
                  <Text style={styles.metaText}>{service.price ? `₹${service.price.toLocaleString()}` : 'Quote'}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={13} color={colors.textMuted} />
                  <Text style={styles.metaText}>{service.duration} min</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add New Service"
          onPress={() => router.push('/pandit-service-edit' as any)}
          icon={<Plus size={18} color={colors.white} />}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 10 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  serviceCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, gap: 8 },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceTitle: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  serviceDescription: { fontSize: 13, color: colors.textLight, lineHeight: 18 },
  serviceMeta: { flexDirection: 'row', gap: 16, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, fontWeight: '500', color: colors.text },
  footer: { padding: 16, backgroundColor: colors.white, borderTopWidth: 0.5, borderTopColor: colors.border },
});
