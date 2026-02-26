import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, Clock, MapPin, User, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/constants/colors';
import { useBookingsStore } from '@/store/bookings-store';
import { useServicesStore } from '@/store/services-store';
import { BookingStatus } from '@/mocks/bookings';
import Button from '@/components/Button';

// US Locations
const US_LOCATIONS = [
  'New York, USA',
  'Los Angeles, USA',
  'San Francisco, USA',
  'Chicago, USA',
  'Houston, USA',
  'Seattle, USA',
  'Dallas, USA',
  'Boston, USA',
  'Atlanta, USA',
  'Miami, USA',
];

// Time slots
const TIME_SLOTS = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', 
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
];

export default function CreateBookingScreen() {
  const router = useRouter();
  const { createBooking, isLoading } = useBookingsStore();
  const { pandits } = useServicesStore();
  
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  // Filter pandits by selected location
  const availablePandits = selectedLocation 
    ? pandits.filter(p => p.location.includes(selectedLocation.split(',')[0]))
    : pandits;

  const handleBook = async () => {
    if (!selectedPandit || !selectedDate || !selectedTime || !selectedLocation) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await createBooking({
        serviceId: '1',
        serviceTitle: 'Puja Service',
        panditId: selectedPandit.id,
        panditName: selectedPandit.name,
        panditImageUrl: selectedPandit.imageUrl,
        userId: 'user1',
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: 120,
        location: selectedLocation,
        price: 150,
        status: BookingStatus.PENDING,
        paymentStatus: 'pending',
      });
      alert('Booking created successfully!');
      router.back();
    } catch (e) {
      console.error(e);
      alert('Failed to create booking');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Service</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.progressStep}>
              <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
                {step > s ? <Check size={14} color={colors.white} /> : <Text style={styles.stepText}>{s}</Text>}
              </View>
              <Text style={[styles.stepLabel, step >= s && styles.stepLabelActive]}>
                {s === 1 ? 'Location' : s === 2 ? 'Pandit' : s === 3 ? 'Date' : 'Time'}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {/* Step 1: Location Selection */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>📍 Select Your Location</Text>
              <Text style={styles.stepSubtitle}>Choose your area to find nearby pandits</Text>
              
              <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setShowLocationPicker(true)}
              >
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.selectorText}>
                  {selectedLocation || 'Tap to select location'}
                </Text>
              </TouchableOpacity>

              {selectedLocation && (
                <Button 
                  title="Continue" 
                  onPress={() => setStep(2)} 
                  size="large" 
                  style={styles.continueBtn}
                />
              )}
            </View>
          )}

          {/* Step 2: Pandit Selection */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>🧙 Select a Pandit</Text>
              <Text style={styles.stepSubtitle}>Available pandits in {selectedLocation}</Text>
              
              <View style={styles.panditList}>
                {availablePandits.length > 0 ? (
                  availablePandits.map((pandit) => (
                    <TouchableOpacity
                      key={pandit.id}
                      style={[styles.panditCard, selectedPandit?.id === pandit.id && styles.panditCardSelected]}
                      onPress={() => setSelectedPandit(pandit)}
                    >
                      <View style={styles.panditInfo}>
                        <Text style={styles.panditName}>{pandit.name}</Text>
                        <Text style={styles.panditSpecialization}>{pandit.specialization}</Text>
                        <View style={styles.panditDetails}>
                          <Text style={styles.panditRating}>⭐ {pandit.rating} ({pandit.reviewCount} reviews)</Text>
                          <Text style={styles.panditExp}>{pandit.experience} years exp.</Text>
                        </View>
                      </View>
                      {selectedPandit?.id === pandit.id && (
                        <View style={styles.checkMark}>
                          <Check size={20} color={colors.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noPandits}>No pandits available in this location</Text>
                )}
              </View>

              {selectedPandit && (
                <Button 
                  title="Continue" 
                  onPress={() => setStep(3)} 
                  size="large" 
                  style={styles.continueBtn}
                />
              )}
            </View>
          )}

          {/* Step 3: Date Selection */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>📅 Select Date</Text>
              <Text style={styles.stepSubtitle}>Choose your preferred date</Text>
              
              <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.selectorText}>
                  {formatDate(selectedDate)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setSelectedDate(date);
                  }}
                  style={styles.datePicker}
                />
              )}

              <Button 
                title="Continue" 
                onPress={() => setStep(4)} 
                size="large" 
                style={styles.continueBtn}
              />
            </View>
          )}

          {/* Step 4: Time Selection */}
          {step === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>⏰ Select Time</Text>
              <Text style={styles.stepSubtitle}>Available time slots for {formatDate(selectedDate)}</Text>
              
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeSlot, selectedTime === time && styles.timeSlotSelected]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.timeSlotText, selectedTime === time && styles.timeSlotTextSelected]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedTime && (
                <Button 
                  title="Confirm Booking" 
                  onPress={handleBook} 
                  loading={isLoading}
                  size="large" 
                  style={styles.continueBtn}
                />
              )}
            </View>
          )}
        </ScrollView>

        {/* Location Picker Modal */}
        <Modal visible={showLocationPicker} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <ScrollView style={styles.locationList}>
                {US_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.locationItem, selectedLocation === loc && styles.locationItemSelected]}
                    onPress={() => {
                      setSelectedLocation(loc);
                      setShowLocationPicker(false);
                    }}
                  >
                    <MapPin size={18} color={selectedLocation === loc ? colors.white : colors.primary} />
                    <Text style={[styles.locationText, selectedLocation === loc && styles.locationTextSelected]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Cancel" variant="ghost" onPress={() => setShowLocationPicker(false)} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  continueBtn: {
    marginTop: 24,
  },
  panditList: {
    gap: 12,
  },
  panditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  panditCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  panditInfo: {
    flex: 1,
  },
  panditName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  panditSpecialization: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  panditDetails: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  panditRating: {
    fontSize: 12,
    color: colors.textMuted,
  },
  panditExp: {
    fontSize: 12,
    color: colors.textMuted,
  },
  checkMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPandits: {
    textAlign: 'center',
    color: colors.textMuted,
    padding: 20,
  },
  datePicker: {
    marginTop: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.text,
  },
  timeSlotTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  locationList: {
    maxHeight: 300,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
    backgroundColor: colors.backgroundLight,
  },
  locationItemSelected: {
    backgroundColor: colors.primary,
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
  },
  locationTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});
