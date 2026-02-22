import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function AddAddressScreen() {
  const router = useRouter();
  const { addAddress } = useOrderStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const handleSave = () => {
    if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    addAddress({ name, phone, addressLine1, addressLine2, city, state, pincode, isDefault: true });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input label="Full Name" placeholder="Enter full name" value={name} onChangeText={setName} />
      <Input label="Phone Number" placeholder="Enter phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Address Line 1" placeholder="House no, Street, Area" value={addressLine1} onChangeText={setAddressLine1} />
      <Input label="Address Line 2 (Optional)" placeholder="Landmark, etc." value={addressLine2} onChangeText={setAddressLine2} />
      <Input label="City" placeholder="Enter city" value={city} onChangeText={setCity} />
      <Input label="State" placeholder="Enter state" value={state} onChangeText={setState} />
      <Input label="Pincode" placeholder="Enter pincode" value={pincode} onChangeText={setPincode} keyboardType="number-pad" />
      <Button title="Save Address" onPress={handleSave} size="large" style={styles.saveBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  saveBtn: { marginTop: 8 },
});
