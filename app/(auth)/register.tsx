import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Phone, Lock } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore, UserRole } from '@/store/auth-store';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { register, googleSignIn, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const selectedRole = (role as UserRole) || 'user';

  const redirectUri = makeRedirectUri({
    ...(Platform.OS === 'web' ? { native: 'https://pandit-com.rork.app' } : {}),
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    scopes: ['profile', 'email'],
    redirectUri: Platform.OS === 'web' ? 'https://pandit-com.rork.app' : redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleRegister(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('[Register] Google auth error:', response.error);
      setGoogleLoading(false);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  }, [response]);

  const handleGoogleRegister = async (accessToken: string) => {
    setGoogleLoading(true);
    try {
      console.log('[Register] Starting Google sign-in with role:', selectedRole);
      await googleSignIn(accessToken, selectedRole);
      console.log('[Register] Google sign-in succeeded, navigating');
      setTimeout(() => {
        if (selectedRole === 'pandit') {
          router.replace('/pandit-onboarding' as any);
        } else {
          router.replace('/(tabs)/(home)' as any);
        }
      }, 100);
    } catch (e) {
      console.error('[Register] Google sign-in error:', e);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      console.log('[Register] Starting email registration with role:', selectedRole);
      await register({
        name,
        email,
        phone,
        password,
        role: selectedRole,
      });
      console.log('[Register] Registration succeeded, navigating');
      setTimeout(() => {
        if (selectedRole === 'pandit') {
          router.replace('/pandit-onboarding' as any);
        } else {
          router.replace('/(tabs)/(home)' as any);
        }
      }, 100);
    } catch (e) {
      console.error('[Register] Registration error:', e);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            {selectedRole === 'pandit' ? 'Register as a Pandit' : 'Join as a Devotee'}
          </Text>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => {
              setGoogleLoading(true);
              promptAsync();
            }}
            disabled={!request || googleLoading || isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>
              {googleLoading ? 'Signing up...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.textMuted} />}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.textMuted} />}
            />
            <Input
              label="Phone (Optional)"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={colors.textMuted} />}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.textMuted} />}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              size="large"
              style={styles.registerBtn}
            />
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
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
  backBtn: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 6,
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
    marginTop: 24,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500' as const,
  },
  form: {
    gap: 0,
  },
  registerBtn: {
    width: '100%',
    marginTop: 8,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: colors.textLight,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600' as const,
  },
});
