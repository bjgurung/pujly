import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Bell, Calendar, Package, CheckCircle, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'order' | 'success' | 'alert';
  read: boolean;
}

const notifications: Notification[] = [
  { id: '1', title: 'Booking Confirmed', message: 'Your booking with Pandit Ramesh Sharma has been confirmed for March 20.', time: '2h ago', type: 'booking', read: false },
  { id: '2', title: 'Order Shipped', message: 'Your order #12345 has been shipped. Track your delivery.', time: '5h ago', type: 'order', read: false },
  { id: '3', title: 'Puja Completed', message: 'Your Naming Ceremony has been completed. Please rate your experience.', time: '1d ago', type: 'success', read: true },
  { id: '4', title: 'Payment Reminder', message: 'Payment for your upcoming booking is due. Please complete it.', time: '2d ago', type: 'alert', read: true },
  { id: '5', title: 'New Service Available', message: 'Virtual Puja services are now available. Book from anywhere!', time: '3d ago', type: 'booking', read: true },
];

const iconMap = {
  booking: <Calendar size={20} color={colors.primary} />,
  order: <Package size={20} color={colors.info} />,
  success: <CheckCircle size={20} color={colors.success} />,
  alert: <AlertCircle size={20} color={colors.warning} />,
};

export default function NotificationsScreen() {
  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={[styles.card, !item.read && styles.unreadCard]}>
      <View style={styles.iconContainer}>{iconMap[item.type]}</View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Bell size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No notifications</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, gap: 8 },
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 14, padding: 14, gap: 12, alignItems: 'flex-start' },
  unreadCard: { backgroundColor: colors.primaryLight },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.backgroundLight, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, marginRight: 8 },
  unreadTitle: { fontWeight: '700' },
  time: { fontSize: 11, color: colors.textMuted },
  message: { fontSize: 13, color: colors.textLight, lineHeight: 18, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyTitle: { fontSize: 16, color: colors.textMuted },
});
