import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, Smartphone, Building2, Plus, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface PaymentMethod {
  id: string;
  type: string;
  label: string;
  details: string;
  icon: React.ReactNode;
  isDefault: boolean;
}

const mockMethods: PaymentMethod[] = [
  { id: '1', type: 'upi', label: 'UPI', details: 'user@upi', icon: <Smartphone size={22} color={colors.primary} />, isDefault: true },
  { id: '2', type: 'card', label: 'Credit Card', details: '•••• 4242', icon: <CreditCard size={22} color={colors.info} />, isDefault: false },
  { id: '3', type: 'bank', label: 'Net Banking', details: 'SBI Account', icon: <Building2 size={22} color={colors.secondary} />, isDefault: false },
];

export default function PaymentMethodsScreen() {
  const [methods] = useState<PaymentMethod[]>(mockMethods);
  const [defaultId, setDefaultId] = useState('1');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.card, defaultId === method.id && styles.cardActive]}
          onPress={() => setDefaultId(method.id)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>{method.icon}</View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodLabel}>{method.label}</Text>
            <Text style={styles.methodDetails}>{method.details}</Text>
          </View>
          {defaultId === method.id && (
            <View style={styles.checkIcon}>
              <Check size={16} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addBtn}>
        <Plus size={20} color={colors.primary} />
        <Text style={styles.addText}>Add Payment Method</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: 16, gap: 14, borderWidth: 1.5, borderColor: 'transparent' },
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  iconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.backgroundLight, alignItems: 'center', justifyContent: 'center' },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  methodDetails: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  checkIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', marginTop: 8 },
  addText: { fontSize: 15, fontWeight: '600', color: colors.primary },
});
