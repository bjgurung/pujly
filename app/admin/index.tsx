import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, CheckCircle, BarChart3, Settings, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const stats = [
  { label: 'Total Users', value: '1,248', icon: <Users size={22} color={colors.primary} />, bg: colors.primaryLight },
  { label: 'Active Pandits', value: '86', icon: <CheckCircle size={22} color={colors.success} />, bg: colors.successLight },
  { label: 'Bookings Today', value: '24', icon: <BarChart3 size={22} color={colors.info} />, bg: colors.infoLight },
  { label: 'Revenue (Month)', value: '$4.2L', icon: <BarChart3 size={22} color={colors.gold} />, bg: colors.accentLight },
];

export default function AdminDashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>{stat.icon}</View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Management</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/admin/pandit-approvals' as any)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <CheckCircle size={20} color={colors.primary} />
            <View>
              <Text style={styles.menuItemLabel}>Pandit Approvals</Text>
              <Text style={styles.menuItemSub}>3 pending approvals</Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Users size={20} color={colors.secondary} />
            <View>
              <Text style={styles.menuItemLabel}>User Management</Text>
              <Text style={styles.menuItemSub}>Manage users and roles</Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Settings size={20} color={colors.textLight} />
            <View>
              <Text style={styles.menuItemLabel}>App Settings</Text>
              <Text style={styles.menuItemSub}>Configure app parameters</Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: colors.white, borderRadius: 16, padding: 16, alignItems: 'flex-start', gap: 8 },
  statIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted },
  menuSection: { marginTop: 4 },
  menuTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderRadius: 14, padding: 16, marginBottom: 8 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  menuItemLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  menuItemSub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
});
