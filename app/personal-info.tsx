import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function PersonalInfoScreen() {
  const { user } = useAuthStore();

  const infoItems = [
    { icon: <User size={20} color={colors.primary} />, label: 'Full Name', value: user?.name || 'Not set' },
    { icon: <Mail size={20} color={colors.primary} />, label: 'Email', value: user?.email || 'Not set' },
    { icon: <Phone size={20} color={colors.primary} />, label: 'Phone', value: user?.phone || 'Not set' },
    { icon: <MapPin size={20} color={colors.primary} />, label: 'Location', value: user?.location || 'Not set' },
    { icon: <Calendar size={20} color={colors.primary} />, label: 'Date of Birth', value: user?.dob || 'Not set' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {infoItems.map((item, index) => (
          <View key={item.label} style={[styles.infoItem, index < infoItems.length - 1 && styles.itemBorder]}>
            {item.icon}
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 4 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  itemBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 15, fontWeight: '500', color: colors.text, marginTop: 2 },
});
