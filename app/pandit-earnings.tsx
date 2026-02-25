import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingUp, Calendar, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type Period = 'week' | 'month' | 'year';

const earningsData = {
  week: { total: 15000, bookings: 4, growth: 12 },
  month: { total: 58000, bookings: 16, growth: 8 },
  year: { total: 680000, bookings: 192, growth: 22 },
};

const transactions = [
  { id: '1', title: 'Wedding Ceremony', amount: 15000, date: 'Feb 20, 2026', status: 'completed' },
  { id: '2', title: 'Griha Pravesh Puja', amount: 8000, date: 'Feb 18, 2026', status: 'completed' },
  { id: '3', title: 'Satyanarayan Puja', amount: 5000, date: 'Feb 15, 2026', status: 'pending' },
  { id: '4', title: 'Naming Ceremony', amount: 3500, date: 'Feb 12, 2026', status: 'completed' },
  { id: '5', title: 'Vastu Consultation', amount: 2000, date: 'Feb 10, 2026', status: 'completed' },
];

export default function PanditEarningsScreen() {
  const [period, setPeriod] = useState<Period>('month');
  const data = earningsData[period];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.periodTabs}>
        {(['week', 'month', 'year'] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodTab, period === p && styles.periodTabActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Year'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Total Earnings</Text>
        <Text style={styles.earningsAmount}>${data.total.toLocaleString()}</Text>
        <View style={styles.growthRow}>
          {data.growth >= 0 ? (
            <ArrowUpRight size={16} color={colors.success} />
          ) : (
            <ArrowDownRight size={16} color={colors.error} />
          )}
          <Text style={[styles.growthText, { color: data.growth >= 0 ? colors.success : colors.error }]}>
            {Math.abs(data.growth)}% vs last {period}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Calendar size={20} color={colors.primary} />
          <Text style={styles.statValue}>{data.bookings}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <IndianRupee size={20} color={colors.gold} />
          <Text style={styles.statValue}>${Math.round(data.total / Math.max(data.bookings, 1)).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Avg / Booking</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={colors.success} />
          <Text style={styles.statValue}>{data.growth}%</Text>
          <Text style={styles.statLabel}>Growth</Text>
        </View>
      </View>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>{tx.title}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmount}>${tx.amount.toLocaleString()}</Text>
              <View style={[styles.txStatus, tx.status === 'completed' ? styles.txCompleted : styles.txPending]}>
                <Text style={[styles.txStatusText, { color: tx.status === 'completed' ? colors.success : colors.warning }]}>
                  {tx.status === 'completed' ? 'Paid' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  periodTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  periodTab: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.white, alignItems: 'center' },
  periodTabActive: { backgroundColor: colors.primary },
  periodTabText: { fontSize: 13, fontWeight: '600', color: colors.textLight },
  periodTabTextActive: { color: colors.white },
  earningsCard: { backgroundColor: colors.white, borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 16 },
  earningsLabel: { fontSize: 14, color: colors.textMuted },
  earningsAmount: { fontSize: 36, fontWeight: '800', color: colors.text, marginTop: 4, letterSpacing: -1 },
  growthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  growthText: { fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted },
  transactionsSection: { marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  txCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 8 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  txDate: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 15, fontWeight: '700', color: colors.text },
  txStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  txCompleted: { backgroundColor: colors.successLight },
  txPending: { backgroundColor: colors.warningLight },
  txStatusText: { fontSize: 11, fontWeight: '600' },
});
