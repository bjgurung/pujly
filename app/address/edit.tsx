import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function EditAddressScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addresses, updateAddress } = useOrderStore();
  const address = addresses.find((a) => a.id === id);

  const [name, setName] = useState(address?.name || '');
  const [phone, setPhone] = useState(address?.phone || '');
  const [addressLine1, setAddressLine1] = useState(address?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(address?.addressLine2 || '');
  const [city, setCity] = useState(address?.city || '');
  const [state, setState] = useState(address?.state || '');
  const [pincode, setPincode] = useState(address?.pincode || '');

  if (!address) {
    return <View style={styles.container}><View /></View>;
  }

  const handleSave = () => {
    if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    updateAddress({ ...address, name, phone, addressLine1, addressLine2, city, state, pincode });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input label="Full Name" value={name} onChangeText={setName} />
      <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Address Line 1" value={addressLine1} onChangeText={setAddressLine1} />
      <Input label="Address Line 2 (Optional)" value={addressLine2} onChangeText={setAddressLine2} />
      <Input label="City" value={city} onChangeText={setCity} />
      <Input label="State" value={state} onChangeText={setState} />
      <Input label="Pincode" value={pincode} onChangeText={setPincode} keyboardType="number-pad" />
      <Button title="Update Address" onPress={handleSave} size="large" style={styles.saveBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  saveBtn: { marginTop: 8 },
});
