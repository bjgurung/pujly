import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useBookingsStore } from '@/store/bookings-store';
import { BookingStatus } from '@/mocks/bookings';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function CreateBookingScreen() {
  const router = useRouter();
  const { createBooking, isLoading } = useBookingsStore();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleBook = async () => {
    if (!date || !time || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      await createBooking({
        serviceId: '1',
        serviceTitle: 'Puja Service',
        panditId: '1',
        panditName: 'Pandit Ramesh Sharma',
        panditImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
        userId: 'user1',
        date,
        time,
        duration: 120,
        location,
        price: 5000,
        status: BookingStatus.PENDING,
        paymentStatus: 'pending',
      });
      Alert.alert('Success', 'Booking created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Book a Service</Text>
      <Text style={styles.subtitle}>Fill in the details for your booking</Text>

      <View style={styles.form}>
        <Input label="Date" placeholder="e.g., March 15, 2026" value={date} onChangeText={setDate} />
        <Input label="Time" placeholder="e.g., 10:00 AM" value={time} onChangeText={setTime} />
        <Input label="Location" placeholder="Enter your address" value={location} onChangeText={setLocation} />
        <View style={styles.notesContainer}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special requirements..."
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <Button title="Confirm Booking" onPress={handleBook} loading={isLoading} size="large" style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 4,
    marginBottom: 24,
  },
  form: {
    gap: 0,
  },
  notesContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
  },
  btn: {
    marginTop: 8,
  },
});
