import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, MapPin, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useServicesStore } from '@/store/services-store';
import { categories } from '@/mocks/categories';
import { packages } from '@/mocks/packages';
import { todayPanchang } from '@/mocks/panchang';
import CategoryCard from '@/components/CategoryCard';
import ServiceCard from '@/components/ServiceCard';
import PanditCard from '@/components/PanditCard';
import PackageCard from '@/components/PackageCard';
import PanchangCard from '@/components/PanchangCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { services, pandits, fetchServices, fetchPandits } = useServicesStore();

  useEffect(() => {
    fetchServices();
    fetchPandits();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting()} 🙏</Text>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            {user?.location && (
              <View style={styles.locationRow}>
                <MapPin size={12} color={colors.primary} />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push('/notifications' as any)}
            >
              <Bell size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search' as any)}
          activeOpacity={0.7}
        >
          <Search size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search services, pandits...</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => router.push(`/category/${item.id}` as any)}
                compact
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <PanchangCard panchang={todayPanchang} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Packages</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={packages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PackageCard pkg={item} onPress={() => router.push(`/service/${item.id}` as any)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={services.slice(0, 6)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ServiceCard
                service={item}
                onPress={() => router.push(`/service/${item.id}` as any)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Pandits</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.panditsList}>
            {pandits.slice(0, 4).map((pandit) => (
              <PanditCard
                key={pandit.id}
                pandit={pandit}
                onPress={() => router.push(`/pandit/${pandit.id}` as any)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
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
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: colors.textLight,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginHorizontal: 20,
    marginTop: 14,
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: colors.textMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: 20,
  },
  panditsList: {
    gap: 0,
  },
});
