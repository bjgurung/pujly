import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, MapPin, ChevronRight, Star, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const { width } = Dimensions.get('window');

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

  const getNamasteGreeting = () => {
    if (user?.name) return `Namaste, ${user.name.split(' ')[0]} 🙏`;
    return 'Namaste, Guest 🙏';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.userName}>{getNamasteGreeting()}</Text>
            {user?.location && (
              <View style={styles.locationRow}>
                <MapPin size={12} color={colors.primary} />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/notifications' as any)}
          >
            <Bell size={22} color={colors.text} />
          </TouchableOpacity>
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
        {/* Enhanced Panchang Card - The Hero Element */}
        <View style={styles.section}>
          <View style={styles.panchangCard}>
            <LinearGradient
              colors={['#FF9933', '#FFB347', '#FFD700'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.panchangGradient}
            >
              {/* Mandala Pattern Overlay */}
              <View style={styles.mandalaOverlay}>
                <Text style={styles.mandalaIcon}>🕉️</Text>
              </View>
              
              <View style={styles.panchangHeader}>
                <Text style={styles.panchangTitle}>Today's Pujya Pankaj</Text>
                <Text style={styles.panchangDate}>{todayPanchang.date}</Text>
              </View>

              <View style={styles.panchangGrid}>
                <View style={styles.panchangItem}>
                  <Text style={styles.panchangLabel}>Tithi</Text>
                  <Text style={styles.panchangValue}>{todayPanchang.tithi}</Text>
                </View>
                <View style={styles.panchangItem}>
                  <Text style={styles.panchangLabel}>Nakshatra</Text>
                  <Text style={styles.panchangValue}>{todayPanchang.nakshatra}</Text>
                </View>
                <View style={styles.panchangItem}>
                  <Text style={styles.panchangLabel}>Yoga</Text>
                  <Text style={styles.panchangValue}>{todayPanchang.yoga}</Text>
                </View>
                <View style={styles.panchangItem}>
                  <Text style={styles.panchangLabel}>Karana</Text>
                  <Text style={styles.panchangValue}>{todayPanchang.karana}</Text>
                </View>
              </View>

              {/* Auspicious Time */}
              <View style={styles.auspiciousSection}>
                <View style={styles.auspiciousHeader}>
                  <View style={styles.auspiciousDot} />
                  <Text style={styles.auspiciousTitle}>Auspicious Muhurat</Text>
                </View>
                <Text style={styles.auspiciousTime}>{todayPanchang.auspiciousTime}</Text>
              </View>

              {/* Sunrise/Sunset */}
              <View style={styles.sunSection}>
                <View style={styles.sunItem}>
                  <Text style={styles.sunLabel}>🌅 Sunrise</Text>
                  <Text style={styles.sunValue}>{todayPanchang.sunrise}</Text>
                </View>
                <View style={styles.sunItem}>
                  <Text style={styles.sunLabel}>🌇 Sunset</Text>
                  <Text style={styles.sunValue}>{todayPanchang.sunset}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Categories - Horizontal Scroll with Glassmorphism */}
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

        {/* Pujly Originals - Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.pujlyOriginalsTitle}>
              <Crown size={20} color="#FF9933" />
              <Text style={styles.sectionTitle}>Pujly Originals</Text>
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={packages.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PackageCard pkg={item} onPress={() => router.push(`/service/${item.id}` as any)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Popular Packages */}
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

        {/* Popular Services */}
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

        {/* Expert Pandits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.pujlyOriginalsTitle}>
              <Star size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Expert Pandits</Text>
            </View>
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
    backgroundColor: '#FFF8F0',
  },
  safeTop: {
    backgroundColor: colors.white,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: colors.textMuted,
    flex: 1,
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
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
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
  
  // Panchang Card Styles
  panchangCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  panchangGradient: {
    padding: 20,
    minHeight: 200,
  },
  mandalaOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.15,
  },
  mandalaIcon: {
    fontSize: 80,
  },
  panchangHeader: {
    marginBottom: 16,
  },
  panchangTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  panchangDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  panchangGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  panchangItem: {
    width: (width - 80) / 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    backdropFilter: 'blur(10px)',
  },
  panchangLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  panchangValue: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '700',
    marginTop: 4,
  },
  auspiciousSection: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backdropFilter: 'blur(10px)',
  },
  auspiciousHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  auspiciousDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  auspiciousTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  auspiciousTime: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  sunSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  sunValue: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
  },
  
  // Pujly Originals
  pujlyOriginalsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
