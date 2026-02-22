import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1604423481263-992cb2a21ca4?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🙏</Text>
            </View>
            <Text style={styles.appName}>PujariSewa</Text>
            <Text style={styles.tagline}>Sacred Rituals, Simplified</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.heading}>Connect with verified Pandits for all your spiritual needs</Text>
          <Text style={styles.subheading}>Book ceremonies, purchase puja items, and get spiritual guidance — all in one place.</Text>

          <View style={styles.buttonGroup}>
            <Button
              title="Get Started"
              onPress={() => router.push('/(auth)/role-select' as any)}
              size="large"
              style={styles.getStartedBtn}
            />
            <Button
              title="I already have an account"
              onPress={() => router.push('/(auth)/login' as any)}
              variant="ghost"
              size="medium"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safe: {
    flex: 1,
  },
  heroSection: {
    flex: 1,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.55)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  bottomSection: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    marginTop: 10,
  },
  buttonGroup: {
    marginTop: 28,
    gap: 8,
  },
  getStartedBtn: {
    width: '100%',
  },
});
