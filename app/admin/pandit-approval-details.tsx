import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Languages, Briefcase, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';

export default function PanditApprovalDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleApprove = () => {
    Alert.alert('Approve', 'Approve this pandit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => { Alert.alert('Success', 'Pandit approved!'); router.back(); } },
    ]);
  };

  const handleReject = () => {
    Alert.alert('Reject', 'Reject this application?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => { Alert.alert('Rejected', 'Application rejected.'); router.back(); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileSection}>
        <Avatar name="Pandit Mohan Das" size={80} />
        <Text style={styles.name}>Pandit Mohan Das</Text>
        <Text style={styles.specialization}>Vedic Astrology</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <MapPin size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>Chennai, Tamil Nadu</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Languages size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>Languages</Text>
            <Text style={styles.infoValue}>Tamil, Hindi, Sanskrit, English</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Briefcase size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>Experience</Text>
            <Text style={styles.infoValue}>12 years</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <FileText size={18} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>Documents</Text>
            <Text style={styles.infoValue}>ID Proof, Certificate uploaded</Text>
          </View>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Pandit Mohan Das has 12 years of experience in Vedic astrology and horoscope reading. He specializes in birth chart analysis, marriage compatibility, and remedial measures.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Approve" onPress={handleApprove} size="large" />
        <Button title="Reject" onPress={handleReject} variant="danger" size="large" />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  profileSection: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, padding: 24 },
  name: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 12 },
  specialization: { fontSize: 15, color: colors.textLight, marginTop: 4 },
  infoCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, gap: 16 },
  infoItem: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 15, fontWeight: '500', color: colors.text, marginTop: 1 },
  aboutSection: { backgroundColor: colors.white, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 8 },
  aboutText: { fontSize: 15, color: colors.textLight, lineHeight: 24 },
  actions: { gap: 10, marginTop: 4 },
});
