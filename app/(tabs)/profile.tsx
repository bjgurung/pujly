import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User, Settings, CreditCard, MapPin, Bell, Heart,
  Package, HelpCircle, Shield, FileText, LogOut,
  ChevronRight, Briefcase, Calendar, DollarSign, LayoutDashboard,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/Avatar';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
  color?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isPandit, isAdmin, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome' as any);
        },
      },
    ]);
  };

  const mainMenuItems: MenuItem[] = [
    { icon: <User size={20} color={colors.primary} />, label: 'Personal Info', route: '/personal-info' },
    { icon: <Package size={20} color={colors.secondary} />, label: 'My Orders', route: '/orders' },
    { icon: <Heart size={20} color={colors.error} />, label: 'Wishlist', route: '/wishlist' },
    { icon: <MapPin size={20} color={colors.info} />, label: 'Addresses', route: '/address/select' },
    { icon: <CreditCard size={20} color={colors.gold} />, label: 'Payment Methods', route: '/payment-methods' },
    { icon: <Bell size={20} color={colors.warning} />, label: 'Notifications', route: '/notifications' },
  ];

  const panditMenuItems: MenuItem[] = isPandit
    ? [
        { icon: <Briefcase size={20} color={colors.primary} />, label: 'My Services', route: '/pandit-services' },
        { icon: <Calendar size={20} color={colors.secondary} />, label: 'My Schedule', route: '/pandit-schedule' },
        { icon: <DollarSign size={20} color={colors.gold} />, label: 'Earnings', route: '/pandit-earnings' },
        { icon: <User size={20} color={colors.info} />, label: 'Pandit Profile', route: '/pandit-profile' },
      ]
    : [];

  const adminMenuItems: MenuItem[] = isAdmin
    ? [{ icon: <LayoutDashboard size={20} color={colors.primary} />, label: 'Admin Dashboard', route: '/admin' }]
    : [];

  const supportMenuItems: MenuItem[] = [
    { icon: <HelpCircle size={20} color={colors.textLight} />, label: 'Help & Support', route: '/help-support' },
    { icon: <Shield size={20} color={colors.textLight} />, label: 'Privacy Policy', route: '/privacy-policy' },
    { icon: <FileText size={20} color={colors.textLight} />, label: 'Terms of Service', route: '/terms-of-service' },
  ];

  const renderMenuSection = (items: MenuItem[], title?: string) => (
    <View style={styles.menuSection}>
      {title && <Text style={styles.menuSectionTitle}>{title}</Text>}
      <View style={styles.menuCard}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.route}
            style={[styles.menuItem, index < items.length - 1 && styles.menuItemBorder]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.6}
          >
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile' as any)}>
            <Settings size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/edit-profile' as any)} activeOpacity={0.7}>
          <Avatar uri={user?.avatar} name={user?.name} size={64} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'guest@example.com'}</Text>
            {isPandit && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Pandit</Text>
              </View>
            )}
            {isAdmin && (
              <View style={[styles.roleBadge, styles.adminBadge]}>
                <Text style={styles.roleBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {adminMenuItems.length > 0 && renderMenuSection(adminMenuItems, 'Admin')}
        {panditMenuItems.length > 0 && renderMenuSection(panditMenuItems, 'Pandit Tools')}
        {renderMenuSection(mainMenuItems, 'Account')}
        {renderMenuSection(supportMenuItems, 'Support')}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeTop: {
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    paddingTop: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  adminBadge: {
    backgroundColor: colors.secondaryLight,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    marginHorizontal: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 14,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});
