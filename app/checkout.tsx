import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { useOrderStore } from '@/store/order-store';
import { useAuthStore } from '@/store/auth-store';
import { trpcClient } from '@/lib/trpc';
import Button from '@/components/Button';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { addOrder, getDefaultAddress } = useOrderStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();
  const deliveryCharge = total > 999 ? 0 : 99;
  const grandTotal = total + deliveryCharge;
  const defaultAddress = getDefaultAddress();

  const handleStripeCheckout = async () => {
    if (!defaultAddress) {
      Alert.alert('Address Required', 'Please add a delivery address', [
        { text: 'Add Address', onPress: () => router.push('/address/add' as any) },
      ]);
      return;
    }

    setIsProcessing(true);
    console.log('[Checkout] Starting Stripe checkout for', items.length, 'items');

    try {
      const stripeItems = items.map((item) => ({
        name: item.product.name,
        price: item.product.discountedPrice || item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0],
      }));

      const result = await trpcClient.payments.createCheckoutSession.mutate({
        items: stripeItems,
        deliveryCharge,
        customerEmail: user?.email,
        metadata: {
          userId: user?.id || 'guest',
          addressId: defaultAddress.id,
        },
      });

      console.log('[Checkout] Stripe session created:', result.sessionId);

      if (result.url) {
        const browserResult = await WebBrowser.openBrowserAsync(result.url, {
          dismissButtonStyle: 'close',
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });

        console.log('[Checkout] Browser result:', browserResult.type);

        if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
          try {
            const status = await trpcClient.payments.getPaymentStatus.query({
              sessionId: result.sessionId,
            });

            if (status.status === 'paid') {
              handlePaymentSuccess();
              return;
            }
          } catch (e) {
            console.log('[Checkout] Could not verify payment status:', e);
          }

          Alert.alert(
            'Payment',
            'Did you complete the payment?',
            [
              {
                text: 'No, cancel',
                style: 'cancel',
              },
              {
                text: 'Yes, I paid',
                onPress: async () => {
                  try {
                    const status = await trpcClient.payments.getPaymentStatus.query({
                      sessionId: result.sessionId,
                    });
                    if (status.status === 'paid') {
                      handlePaymentSuccess();
                    } else {
                      Alert.alert('Payment Pending', 'Your payment is still being processed. Please check your orders later.');
                    }
                  } catch {
                    handlePaymentSuccess();
                  }
                },
              },
            ]
          );
        }
      }
    } catch (e) {
      console.error('[Checkout] Stripe checkout error:', e);
      Alert.alert('Payment Error', 'Failed to start payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    addOrder({
      items,
      total: grandTotal,
      address: defaultAddress!,
      paymentMethod: 'stripe',
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
                ${((item.product.discountedPrice || item.product.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.paymentHeader}>
            <CreditCard size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Payment</Text>
          </View>
          <View style={styles.stripeCard}>
            <View style={styles.stripeInfo}>
              <Text style={styles.stripeLogo}>stripe</Text>
              <Text style={styles.stripeSubtext}>Secure payment via Stripe</Text>
            </View>
            <ShieldCheck size={20} color={colors.success} />
          </View>
          <Text style={styles.paymentNote}>
            You'll be redirected to Stripe's secure checkout to complete your payment.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, deliveryCharge === 0 && styles.freeText]}>
              {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.processingText}>Preparing checkout...</Text>
          </View>
        ) : (
          <Button
            title={`Pay $${grandTotal.toFixed(2)}`}
            onPress={handleStripeCheckout}
            size="large"
            disabled={items.length === 0}
          />
        )}
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
    fontWeight: '500' as const,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600' as const,
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
    fontWeight: '600' as const,
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
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
    fontWeight: '600' as const,
    color: colors.text,
  },
  stripeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F9FC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3E8EE',
  },
  stripeInfo: {
    gap: 2,
  },
  stripeLogo: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#635BFF',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  stripeSubtext: {
    fontSize: 12,
    color: '#6B7294',
  },
  paymentNote: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
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
    fontWeight: '500' as const,
    color: colors.text,
  },
  freeText: {
    color: colors.success,
    fontWeight: '600' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textLight,
  },
});
