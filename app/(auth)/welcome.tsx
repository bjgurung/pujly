import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Button from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { googleSignIn } = useAuthStore();
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleSignIn(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('[Welcome] Google auth error:', response.error);
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleSignIn = async (accessToken: string) => {
    setGoogleLoading(true);
    try {
      await googleSignIn(accessToken, 'user');
      router.replace('/(tabs)/(home)' as any);
    } catch {
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

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
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => {
                setGoogleLoading(true);
                promptAsync();
              }}
              disabled={!request || googleLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

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
    fontWeight: '800' as const,
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
    fontWeight: '700' as const,
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
    marginTop: 24,
    gap: 10,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#4285F4',
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  getStartedBtn: {
    width: '100%',
  },
});
