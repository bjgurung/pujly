import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useBookingsStore } from '@/store/bookings-store';
import { BookingStatus } from '@/mocks/bookings';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  [BookingStatus.PENDING]: { label: 'Pending', color: colors.warning, bg: colors.warningLight },
  [BookingStatus.CONFIRMED]: { label: 'Confirmed', color: colors.info, bg: colors.infoLight },
  [BookingStatus.COMPLETED]: { label: 'Completed', color: colors.success, bg: colors.successLight },
  [BookingStatus.CANCELLED]: { label: 'Cancelled', color: colors.error, bg: colors.errorLight },
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBookingById, cancelBooking } = useBookingsStore();
  const booking = getBookingById(id || '');

  if (!booking) {
    return (
      <View style={styles.notFound}>
        <Text>Booking not found</Text>
      </View>
    );
  }

  const status = statusConfig[booking.status];
  const canCancel = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          await cancelBooking(booking.id);
          Alert.alert('Success', 'Booking cancelled successfully');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `Booking #${booking.id}` }} />

      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
          <Text style={styles.price}>${booking.price.toLocaleString()}</Text>
        </View>

        <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>

        <View style={styles.panditRow}>
          <Avatar uri={booking.panditImageUrl} name={booking.panditName} size={44} />
          <View>
            <Text style={styles.panditName}>{booking.panditName}</Text>
            <Text style={styles.panditLabel}>Pandit</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Booking Details</Text>
        <View style={styles.detailItem}>
          <Calendar size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{booking.date}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Clock size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.detailLabel}>Time & Duration</Text>
            <Text style={styles.detailValue}>{booking.time} ({booking.duration} min)</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{booking.location}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <CreditCard size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.detailLabel}>Payment</Text>
            <Text style={styles.detailValue}>{booking.paymentStatus}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {canCancel && (
          <Button title="Cancel Booking" onPress={handleCancel} variant="danger" size="large" />
        )}
        <Button
          title="Contact Pandit"
          onPress={() => router.push(`/chat/${booking.panditId}` as any)}
          variant="outline"
          size="large"
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
  card: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  panditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  panditName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  panditLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  detailsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  detailsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginTop: 1,
  },
  actions: {
    padding: 16,
    gap: 10,
  },
});
