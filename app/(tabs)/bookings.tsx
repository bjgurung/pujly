import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useBookingsStore } from '@/store/bookings-store';
import { BookingStatus } from '@/mocks/bookings';
import BookingCard from '@/components/BookingCard';

const tabs = [
  { key: 'all', label: 'All' },
  { key: BookingStatus.PENDING, label: 'Pending' },
  { key: BookingStatus.CONFIRMED, label: 'Confirmed' },
  { key: BookingStatus.COMPLETED, label: 'Completed' },
  { key: BookingStatus.CANCELLED, label: 'Cancelled' },
];

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings } = useBookingsStore();
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [activeTab, bookings]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => router.push(`/booking/${booking.id}` as any)}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Calendar size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>Your bookings will appear here</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeTop: {
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  tabsRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
