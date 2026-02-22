import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Package, MapPin, CreditCard, Truck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';
import Button from '@/components/Button';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, cancelOrder } = useOrderStore();
  const order = getOrder(id || '');

  if (!order) {
    return (
      <View style={styles.notFound}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const handleCancel = () => {
    Alert.alert('Cancel Order', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => cancelOrder(order.id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: `Order #${order.id.slice(-6)}` }} />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item) => (
          <View key={item.product.id} style={styles.item}>
            <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>
              ₹{((item.product.discountedPrice || item.product.price) * item.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <MapPin size={18} color={colors.textMuted} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Delivery Address</Text>
            <Text style={styles.infoValue}>{order.address.name}</Text>
            <Text style={styles.infoSubtext}>
              {order.address.addressLine1}, {order.address.city} - {order.address.pincode}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <CreditCard size={18} color={colors.textMuted} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Payment</Text>
            <Text style={styles.infoValue}>{order.paymentMethod.toUpperCase()}</Text>
          </View>
        </View>
        {order.estimatedDelivery && (
          <View style={styles.infoRow}>
            <Truck size={18} color={colors.textMuted} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estimated Delivery</Text>
              <Text style={styles.infoValue}>{order.estimatedDelivery}</Text>
            </View>
          </View>
        )}
      </View>

      {order.status === 'pending' && (
        <Button title="Cancel Order" onPress={handleCancel} variant="danger" size="large" />
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
  content: {
    padding: 16,
    gap: 12,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
  },
  itemQty: {
    fontSize: 13,
    color: colors.textMuted,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginTop: 1,
  },
  infoSubtext: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 1,
  },
});
