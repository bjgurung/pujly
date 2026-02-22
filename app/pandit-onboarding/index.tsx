import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';

export default function PanditOnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <BookOpen size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome, Pandit Ji!</Text>
          <Text style={styles.subtitle}>
            Complete your profile to start offering services on PujariSewa. It only takes a few minutes.
          </Text>

          <View style={styles.steps}>
            {['Personal Details', 'Qualifications', 'Services Offered', 'Schedule', 'Documents', 'Verification'].map((step, index) => (
              <View key={step} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepLabel}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Start Onboarding" onPress={() => router.replace('/(tabs)/(home)' as any)} size="large" />
          <Button title="Skip for Now" onPress={() => router.replace('/(tabs)/(home)' as any)} variant="ghost" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  iconContainer: { width: 96, height: 96, borderRadius: 28, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textLight, textAlign: 'center', lineHeight: 22, marginTop: 10, paddingHorizontal: 10 },
  steps: { marginTop: 32, width: '100%', gap: 12 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.backgroundLight, padding: 14, borderRadius: 12 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: colors.white },
  stepLabel: { fontSize: 15, fontWeight: '500', color: colors.text },
  footer: { paddingHorizontal: 24, paddingBottom: 20, gap: 8 },
});
