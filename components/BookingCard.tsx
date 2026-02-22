import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Avatar from './Avatar';
import { BookingStatus } from '@/mocks/bookings';

interface BookingCardProps {
  booking: {
    id: string;
    serviceTitle: string;
    panditName: string;
    panditImageUrl: string;
    date: string;
    time: string;
    duration: number;
    location: string;
    price: number;
    status: BookingStatus;
    paymentStatus: string;
  };
  onPress: () => void;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  [BookingStatus.PENDING]: { label: 'Pending', color: colors.warning, bg: colors.warningLight },
  [BookingStatus.CONFIRMED]: { label: 'Confirmed', color: colors.info, bg: colors.infoLight },
  [BookingStatus.COMPLETED]: { label: 'Completed', color: colors.success, bg: colors.successLight },
  [BookingStatus.CANCELLED]: { label: 'Cancelled', color: colors.error, bg: colors.errorLight },
};

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const status = statusConfig[booking.status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle} numberOfLines={1}>{booking.serviceTitle}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.price}>₹{booking.price.toLocaleString()}</Text>
      </View>

      <View style={styles.panditRow}>
        <Avatar uri={booking.panditImageUrl} name={booking.panditName} size={36} />
        <Text style={styles.panditName}>{booking.panditName}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Calendar size={13} color={colors.textMuted} />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={13} color={colors.textMuted} />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={13} color={colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>{booking.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
    gap: 6,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  panditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  panditName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
