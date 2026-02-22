import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useServicesStore } from '@/store/services-store';
import ServiceCard from '@/components/ServiceCard';
import PanditCard from '@/components/PanditCard';

type Tab = 'services' | 'pandits';

export default function SearchScreen() {
  const router = useRouter();
  const { services, pandits, searchServices, searchPandits } = useServicesStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('services');

  const filteredServices = useMemo(() => {
    if (!query.trim()) return services;
    return searchServices(query);
  }, [query, services]);

  const filteredPandits = useMemo(() => {
    if (!query.trim()) return pandits;
    return searchPandits(query);
  }, [query, pandits]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services, pandits..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'services' && styles.tabActive]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>
              Services ({filteredServices.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pandits' && styles.tabActive]}
            onPress={() => setActiveTab('pandits')}
          >
            <Text style={[styles.tabText, activeTab === 'pandits' && styles.tabTextActive]}>
              Pandits ({filteredPandits.length})
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
        {activeTab === 'services' ? (
          filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => router.push(`/service/${service.id}` as any)}
                horizontal
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          )
        ) : (
          filteredPandits.length > 0 ? (
            filteredPandits.map((pandit) => (
              <PanditCard
                key={pandit.id}
                pandit={pandit}
                onPress={() => router.push(`/pandit/${pandit.id}` as any)}
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No pandits found</Text>
            </View>
          )
        )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.white,
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
});
