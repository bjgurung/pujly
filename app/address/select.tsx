import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Plus, Check, Trash2, Edit2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';
import Button from '@/components/Button';

export default function SelectAddressScreen() {
  const router = useRouter();
  const { addresses, setDefaultAddress, removeAddress } = useOrderStore();

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeAddress(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {addresses.length === 0 ? (
          <View style={styles.empty}>
            <MapPin size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No addresses saved</Text>
            <Text style={styles.emptyText}>Add a delivery address to get started</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[styles.addressCard, address.isDefault && styles.addressCardActive]}
              onPress={() => setDefaultAddress(address.id)}
              activeOpacity={0.7}
            >
              <View style={styles.addressHeader}>
                <View style={styles.addressNameRow}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Check size={12} color={colors.white} />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressActions}>
                  <TouchableOpacity onPress={() => router.push({ pathname: '/address/edit' as any, params: { id: address.id } })}>
                    <Edit2 size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(address.id)}>
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.addressPhone}>{address.phone}</Text>
              <Text style={styles.addressText}>
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              </Text>
              <Text style={styles.addressText}>
                {address.city}, {address.state} - {address.pincode}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add New Address"
          onPress={() => router.push('/address/add' as any)}
          icon={<Plus size={18} color={colors.white} />}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 10 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 8 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  addressCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: 'transparent' },
  addressCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  addressNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressName: { fontSize: 16, fontWeight: '600', color: colors.text },
  defaultBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  defaultText: { fontSize: 11, fontWeight: '600', color: colors.white },
  addressActions: { flexDirection: 'row', gap: 14 },
  addressPhone: { fontSize: 13, color: colors.textLight, marginBottom: 4 },
  addressText: { fontSize: 14, color: colors.textLight, lineHeight: 20 },
  footer: { padding: 16, backgroundColor: colors.white, borderTopWidth: 0.5, borderTopColor: colors.border },
});
