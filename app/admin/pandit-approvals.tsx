import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Avatar from '@/components/Avatar';

interface PanditApproval {
  id: string;
  name: string;
  avatar?: string;
  specialization: string;
  location: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const approvals: PanditApproval[] = [
  { id: '1', name: 'Pandit Mohan Das', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', specialization: 'Vedic Astrology', location: 'Chennai', submittedAt: '2 days ago', status: 'pending' },
  { id: '2', name: 'Pandit Ravi Shankar', specialization: 'Wedding Ceremonies', location: 'Kolkata', submittedAt: '3 days ago', status: 'pending' },
  { id: '3', name: 'Acharya Suresh', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop', specialization: 'Festival Pujas', location: 'Jaipur', submittedAt: '5 days ago', status: 'pending' },
];

export default function PanditApprovalsScreen() {
  const router = useRouter();

  const renderApproval = ({ item }: { item: PanditApproval }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/admin/pandit-approval-details' as any, params: { id: item.id } })}
      activeOpacity={0.7}
    >
      <Avatar uri={item.avatar} name={item.name} size={48} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialization}>{item.specialization}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.location}>{item.location}</Text>
          <View style={styles.timeRow}>
            <Clock size={12} color={colors.textMuted} />
            <Text style={styles.timeText}>{item.submittedAt}</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={approvals}
        keyExtractor={(item) => item.id}
        renderItem={renderApproval}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: 14, gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  specialization: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  location: { fontSize: 12, color: colors.textMuted },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 12, color: colors.textMuted },
});
