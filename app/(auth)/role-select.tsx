import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, BookOpen, ChevronLeft } from 'lucide-react-native';
import Button from '@/components/Button';
import { colors } from '@/constants/colors';
import { UserRole } from '@/store/auth-store';

const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'user',
    title: 'Devotee',
    description: 'Book pujas, buy items, and connect with pandits',
    icon: <User size={28} color={colors.primary} />,
  },
  {
    id: 'pandit',
    title: 'Pandit',
    description: 'Offer your services and manage bookings',
    icon: <BookOpen size={28} color={colors.secondary} />,
  },
];

export default function RoleSelectScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>How would you like to use PujariSewa?</Text>
          <Text style={styles.subtitle}>You can change this later in settings</Text>

          <View style={styles.rolesContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, selectedRole === role.id && styles.roleCardSelected]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.roleIcon, selectedRole === role.id && styles.roleIconSelected]}>
                  {role.icon}
                </View>
                <View style={styles.roleInfo}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>
                <View style={[styles.radio, selectedRole === role.id && styles.radioSelected]}>
                  {selectedRole === role.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => router.push({ pathname: '/(auth)/register' as any, params: { role: selectedRole } })}
            size="large"
          />
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 8,
  },
  rolesContainer: {
    marginTop: 32,
    gap: 14,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 14,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconSelected: {
    backgroundColor: colors.white,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  roleDescription: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 3,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
