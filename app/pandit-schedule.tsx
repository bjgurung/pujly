import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['6:00 AM - 9:00 AM', '9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM'];

interface DaySchedule {
  day: string;
  available: boolean;
  slots: string[];
}

export default function PanditScheduleScreen() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    days.map((day) => ({
      day,
      available: day !== 'Sunday',
      slots: day !== 'Sunday' ? ['9:00 AM - 12:00 PM', '3:00 PM - 6:00 PM'] : [],
    }))
  );

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((item, index) =>
        index === dayIndex
          ? { ...item, available: !item.available, slots: !item.available ? [] : item.slots }
          : item
      )
    );
  };

  const toggleSlot = (dayIndex: number, slot: string) => {
    setSchedule((prev) =>
      prev.map((item, index) =>
        index === dayIndex
          ? {
              ...item,
              slots: item.slots.includes(slot)
                ? item.slots.filter((s) => s !== slot)
                : [...item.slots, slot],
            }
          : item
      )
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Set Your Availability</Text>
      <Text style={styles.subtitle}>Select the days and time slots when you're available</Text>

      {schedule.map((daySchedule, dayIndex) => (
        <View key={daySchedule.day} style={styles.dayCard}>
          <TouchableOpacity
            style={styles.dayHeader}
            onPress={() => toggleDay(dayIndex)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, daySchedule.available && styles.checkboxActive]}>
              {daySchedule.available && <Check size={14} color={colors.white} />}
            </View>
            <Text style={[styles.dayName, !daySchedule.available && styles.dayNameDisabled]}>
              {daySchedule.day}
            </Text>
          </TouchableOpacity>

          {daySchedule.available && (
            <View style={styles.slotsContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotChip, daySchedule.slots.includes(slot) && styles.slotChipActive]}
                  onPress={() => toggleSlot(dayIndex, slot)}
                >
                  <Clock size={12} color={daySchedule.slots.includes(slot) ? colors.white : colors.textMuted} />
                  <Text style={[styles.slotText, daySchedule.slots.includes(slot) && styles.slotTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textLight, marginTop: 4, marginBottom: 20 },
  dayCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, marginBottom: 10 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayName: { fontSize: 16, fontWeight: '600', color: colors.text },
  dayNameDisabled: { color: colors.textMuted },
  slotsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingLeft: 36 },
  slotChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.backgroundLight },
  slotChipActive: { backgroundColor: colors.primary },
  slotText: { fontSize: 12, color: colors.textLight },
  slotTextActive: { color: colors.white, fontWeight: '600' },
});
