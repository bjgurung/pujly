import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';

const statusColors: Record<string, { color: string; bg: string }> = {
  pending: { color: colors.warning, bg: colors.warningLight },
  processing: { color: colors.info, bg: colors.infoLight },
  shipped: { color: colors.secondary, bg: colors.secondaryLight },
  delivered: { color: colors.success, bg: colors.successLight },
  cancelled: { color: colors.error, bg: colors.errorLight },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrderStore();

  if (orders.length === 0) {
    return (
      <View style={styles.empty}>
        <Package size={56} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>Your orders will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {orders.map((order) => {
        const sc = statusColors[order.status] || statusColors.pending;
        return (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => router.push(`/order/${order.id}` as any)}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.statusText, { color: sc.color }]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.itemCount}>{order.items.length} item(s)</Text>
              <View style={styles.orderTotal}>
                <Text style={styles.totalText}>${order.total.toLocaleString()}</Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
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
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  itemCount: {
    fontSize: 13,
    color: colors.textLight,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
