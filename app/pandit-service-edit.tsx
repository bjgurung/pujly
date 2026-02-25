import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function PanditServiceEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getServiceById } = useServicesStore();
  const service = id ? getServiceById(id) : undefined;

  const [title, setTitle] = useState(service?.title || '');
  const [description, setDescription] = useState(service?.description || '');
  const [price, setPrice] = useState(service?.price?.toString() || '');
  const [duration, setDuration] = useState(service?.duration?.toString() || '');
  const [location, setLocation] = useState(service?.location || '');

  const handleSave = () => {
    if (!title || !description || !price || !duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', `Service ${id ? 'updated' : 'created'} successfully`);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input label="Service Title" placeholder="e.g., Griha Pravesh Puja" value={title} onChangeText={setTitle} />
      <View style={styles.descContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your service..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      <Input label="Price ($)" placeholder="e.g., 5000" value={price} onChangeText={setPrice} keyboardType="number-pad" />
      <Input label="Duration (minutes)" placeholder="e.g., 120" value={duration} onChangeText={setDuration} keyboardType="number-pad" />
      <Input label="Location" placeholder="e.g., United States" value={location} onChangeText={setLocation} />
      <Button title={id ? 'Update Service' : 'Create Service'} onPress={handleSave} size="large" style={styles.saveBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  descContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 8 },
  descInput: { backgroundColor: colors.backgroundLight, borderRadius: 12, padding: 14, fontSize: 16, color: colors.text, minHeight: 100 },
  saveBtn: { marginTop: 8 },
});
