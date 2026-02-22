import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { useOrderStore } from '@/store/order-store';
import Button from '@/components/Button';

const paymentMethods = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit/Debit Card' },
  { id: 'cod', label: 'Cash on Delivery' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { addOrder, getDefaultAddress, addresses } = useOrderStore();
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const total = getCartTotal();
  const deliveryCharge = total > 999 ? 0 : 99;
  const grandTotal = total + deliveryCharge;
  const defaultAddress = getDefaultAddress();

  const handlePlaceOrder = () => {
    if (!defaultAddress) {
      Alert.alert('Address Required', 'Please add a delivery address', [
        { text: 'Add Address', onPress: () => router.push('/address/add' as any) },
      ]);
      return;
    }

    const orderId = addOrder({
      items,
      total: grandTotal,
      address: defaultAddress,
      paymentMethod: selectedPayment,
      status: 'pending',
      estimatedDelivery: '3-5 business days',
    });

    clearCart();
    router.replace('/order-success' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.addressCard}
          onPress={() => router.push('/address/select' as any)}
          activeOpacity={0.7}
        >
          <MapPin size={20} color={colors.primary} />
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            {defaultAddress ? (
              <>
                <Text style={styles.addressName}>{defaultAddress.name}</Text>
                <Text style={styles.addressText}>
                  {defaultAddress.addressLine1}, {defaultAddress.city} - {defaultAddress.pincode}
                </Text>
              </>
            ) : (
              <Text style={styles.addAddressText}>Add delivery address</Text>
            )}
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={styles.orderItemName} numberOfLines={1}>{item.product.name} x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>
                ₹{((item.product.discountedPrice || item.product.price) * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentOption, selectedPayment === method.id && styles.paymentOptionActive]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <CreditCard size={18} color={selectedPayment === method.id ? colors.primary : colors.textMuted} />
              <Text style={[styles.paymentLabel, selectedPayment === method.id && styles.paymentLabelActive]}>
                {method.label}
              </Text>
              <View style={[styles.radio, selectedPayment === method.id && styles.radioActive]}>
                {selectedPayment === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, deliveryCharge === 0 && styles.freeText]}>
              {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={`Pay ₹${grandTotal.toLocaleString()}`} onPress={handlePlaceOrder} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  addressText: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  addAddressText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemName: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
    marginRight: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    gap: 12,
  },
  paymentOptionActive: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  paymentLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textLight,
  },
  paymentLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  freeText: {
    color: colors.success,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});
