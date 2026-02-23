import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Service, Pandit, Category } from '@/mocks/services';
import { FALLBACK_SERVICES, FALLBACK_PANDITS, FALLBACK_CATEGORIES } from '@/mocks/fallback-data';

let trpcClientRef: any = null;
const getTrpcClient = () => {
  if (!trpcClientRef) {
    try {
      const { trpcClient } = require('@/lib/trpc');
      trpcClientRef = trpcClient;
    } catch (e) {
      console.error('[Services] Failed to load trpc client:', e);
    }
  }
  return trpcClientRef;
};

function mapDbService(row: Record<string, unknown>): Service {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    description: String(row.description || ''),
    price: Number(row.price) || null,
    duration: Number(row.duration) || 0,
    location: String(row.location || ''),
    imageUrl: String(row.image_url || row.imageUrl || ''),
    rating: Number(row.rating) || 0,
    reviewCount: Number(row.review_count || row.reviewCount) || 0,
    panditId: String(row.pandit_id || row.panditId || ''),
    categoryId: String(row.category_id || row.categoryId || ''),
  };
}

function mapDbPandit(row: Record<string, unknown>): Pandit {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    specialization: String(row.specialization || ''),
    about: String(row.about || ''),
    location: String(row.location || ''),
    imageUrl: String(row.image_url || row.imageUrl || ''),
    languages: Array.isArray(row.languages) ? row.languages as string[] : [],
    rating: Number(row.rating) || 0,
    reviewCount: Number(row.review_count || row.reviewCount) || 0,
    verified: Boolean(row.verified),
    experience: Number(row.experience) || 0,
    categoryIds: Array.isArray(row.category_ids || row.categoryIds) ? (row.category_ids || row.categoryIds) as string[] : [],
    services: Array.isArray(row.services) ? row.services as string[] : [],
  };
}

function mapDbCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    title: String(row.title || row.name || ''),
    description: row.description ? String(row.description) : undefined,
    imageUrl: String(row.image_url || row.imageUrl || ''),
    count: Number(row.count) || 0,
  };
}

interface ServicesState {
  services: Service[];
  pandits: Pandit[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  fetchPandits: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
  getPanditById: (id: string) => Pandit | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getServicesByCategory: (categoryId: string) => Service[];
  getPanditsByCategory: (categoryId: string) => Pandit[];
  getServicesByPandit: (panditId: string) => Service[];
  searchServices: (query: string) => Service[];
  searchPandits: (query: string) => Pandit[];
}

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      services: FALLBACK_SERVICES,
      pandits: FALLBACK_PANDITS,
      categories: FALLBACK_CATEGORIES,
      isLoading: false,
      error: null,

      fetchServices: async () => {
        set({ isLoading: true, error: null });
        try {
          const client = getTrpcClient();
          if (!client) { set({ services: FALLBACK_SERVICES, isLoading: false }); return; }
          const data = await client.data.getServices.query();
          if (data && data.length > 0) {
            const mapped = data.map((row: Record<string, unknown>) => mapDbService(row));
            console.log('[Services] Fetched', mapped.length, 'services from API');
            set({ services: mapped, isLoading: false });
          } else {
            console.log('[Services] No data from API, using fallback');
            set({ services: FALLBACK_SERVICES, isLoading: false });
          }
        } catch (e) {
          console.log('[Services] API error, using fallback:', e);
          set({ services: FALLBACK_SERVICES, isLoading: false });
        }
      },

      fetchPandits: async () => {
        set({ isLoading: true, error: null });
        try {
          const client = getTrpcClient();
          if (!client) { set({ pandits: FALLBACK_PANDITS, isLoading: false }); return; }
          const data = await client.data.getPandits.query();
          if (data && data.length > 0) {
            const mapped = data.map((row: Record<string, unknown>) => mapDbPandit(row));
            console.log('[Services] Fetched', mapped.length, 'pandits from API');
            set({ pandits: mapped, isLoading: false });
          } else {
            console.log('[Services] No pandits from API, using fallback');
            set({ pandits: FALLBACK_PANDITS, isLoading: false });
          }
        } catch (e) {
          console.log('[Services] Pandits API error, using fallback:', e);
          set({ pandits: FALLBACK_PANDITS, isLoading: false });
        }
      },

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          const client = getTrpcClient();
          if (!client) { set({ categories: FALLBACK_CATEGORIES, isLoading: false }); return; }
          const data = await client.data.getCategories.query();
          if (data && data.length > 0) {
            const mapped = data.map((row: Record<string, unknown>) => mapDbCategory(row));
            console.log('[Services] Fetched', mapped.length, 'categories from API');
            set({ categories: mapped, isLoading: false });
          } else {
            console.log('[Services] No categories from API, using fallback');
            set({ categories: FALLBACK_CATEGORIES, isLoading: false });
          }
        } catch (e) {
          console.log('[Services] Categories API error, using fallback:', e);
          set({ categories: FALLBACK_CATEGORIES, isLoading: false });
        }
      },

      getServiceById: (id: string) => get().services.find(s => s.id === id),
      getPanditById: (id: string) => get().pandits.find(p => p.id === id),
      getCategoryById: (id: string) => get().categories.find(c => c.id === id),
      getServicesByCategory: (categoryId: string) => get().services.filter(s => s.categoryId === categoryId),
      getPanditsByCategory: (categoryId: string) => get().pandits.filter(p => Array.isArray(p.categoryIds) && p.categoryIds.includes(categoryId)),
      getServicesByPandit: (panditId: string) => get().services.filter(s => s.panditId === panditId),

      searchServices: (query: string) => {
        const q = query.toLowerCase();
        return get().services.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
        );
      },

      searchPandits: (query: string) => {
        const q = query.toLowerCase();
        return get().pandits.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.specialization.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (Array.isArray(p.languages) && p.languages.some(l => l.toLowerCase().includes(q)))
        );
      },
    }),
    {
      name: 'services-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
