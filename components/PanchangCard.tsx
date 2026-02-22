import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sunrise, Sunset, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Panchang } from '@/mocks/panchang';

interface PanchangCardProps {
  panchang: Panchang;
}

export default function PanchangCard({ panchang }: PanchangCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Panchang</Text>
        <Text style={styles.date}>{panchang.date}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Tithi</Text>
          <Text style={styles.value}>{panchang.tithi}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Nakshatra</Text>
          <Text style={styles.value}>{panchang.nakshatra}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Yoga</Text>
          <Text style={styles.value}>{panchang.yoga}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Karana</Text>
          <Text style={styles.value}>{panchang.karana}</Text>
        </View>
      </View>

      <View style={styles.sunRow}>
        <View style={styles.sunItem}>
          <Sunrise size={16} color={colors.gold} />
          <Text style={styles.sunText}>{panchang.sunrise}</Text>
        </View>
        <View style={styles.sunItem}>
          <Sunset size={16} color={colors.primary} />
          <Text style={styles.sunText}>{panchang.sunset}</Text>
        </View>
      </View>

      {panchang.auspiciousTimes.length > 0 && (
        <View style={styles.timesSection}>
          <View style={styles.timesRow}>
            <Clock size={14} color={colors.success} />
            <Text style={styles.timesLabel}>Auspicious:</Text>
          </View>
          <Text style={styles.timesValue}>{panchang.auspiciousTimes.join(' | ')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accentLight,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  gridItem: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 10,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  sunRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  timesSection: {
    marginTop: 4,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  timesValue: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 16,
  },
});
