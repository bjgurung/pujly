import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Service, Pandit, Category } from '@/mocks/services';

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Griha Pravesh Puja',
    description: 'Traditional housewarming ceremony to bless your new home with positive energy and prosperity.',
    price: 5000,
    duration: 180,
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    panditId: '1',
    categoryId: '1',
  },
  {
    id: '2',
    title: 'Satyanarayan Puja',
    description: 'Sacred ritual dedicated to Lord Vishnu, performed for prosperity and well-being of the family.',
    price: 3500,
    duration: 120,
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1600093112291-7b553e3fcb82?q=80&w=2070&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 98,
    panditId: '2',
    categoryId: '1',
  },
  {
    id: '3',
    title: 'Naming Ceremony',
    description: 'Traditional ceremony to name your newborn child with proper Vedic rituals.',
    price: 2500,
    duration: 90,
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1555050455-f96634b5cba6?q=80&w=2033&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 76,
    panditId: '3',
    categoryId: '2',
  },
  {
    id: '4',
    title: 'Wedding Ceremony',
    description: 'Complete traditional Hindu wedding ceremony with all rituals and customs.',
    price: 15000,
    duration: 360,
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 152,
    panditId: '1',
    categoryId: '3',
  },
  {
    id: '5',
    title: 'Vastu Consultation',
    description: 'Expert consultation to harmonize your living or working space according to Vastu principles.',
    price: 2000,
    duration: 60,
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 87,
    panditId: '4',
    categoryId: '4',
  },
  {
    id: '6',
    title: 'Mundan Ceremony',
    description: 'Traditional first haircut ceremony for children with proper rituals.',
    price: 3000,
    duration: 120,
    location: 'Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 65,
    panditId: '2',
    categoryId: '2',
  },
];

const mockPandits: Pandit[] = [
  {
    id: '1',
    name: 'Pandit Ramesh Sharma',
    specialization: 'Vedic Rituals & Ceremonies',
    about: 'With over 20 years of experience, Pandit Ramesh Sharma is an expert in performing various Vedic rituals.',
    location: 'Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    languages: ['Hindi', 'Sanskrit', 'English'],
    rating: 4.8,
    reviewCount: 156,
    verified: true,
    experience: 20,
    categoryIds: ['1', '3'],
    services: ['1', '4'],
  },
  {
    id: '2',
    name: 'Pandit Suresh Joshi',
    specialization: 'Family Ceremonies & Pujas',
    about: 'Pandit Suresh Joshi specializes in family ceremonies, bringing positive energy to households.',
    location: 'Noida',
    imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
    languages: ['Hindi', 'Sanskrit'],
    rating: 4.7,
    reviewCount: 124,
    verified: true,
    experience: 18,
    categoryIds: ['1', '2'],
    services: ['2', '6'],
  },
  {
    id: '3',
    name: 'Pandit Vijay Mishra',
    specialization: 'Child Ceremonies & Rituals',
    about: 'Pandit Vijay Mishra is known for his expertise in child-related ceremonies and rituals.',
    location: 'Ghaziabad',
    imageUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1964&auto=format&fit=crop',
    languages: ['Hindi', 'Sanskrit', 'English'],
    rating: 4.9,
    reviewCount: 98,
    verified: true,
    experience: 15,
    categoryIds: ['2'],
    services: ['3'],
  },
  {
    id: '4',
    name: 'Pandit Rajesh Trivedi',
    specialization: 'Vastu & Astrology',
    about: 'Pandit Rajesh Trivedi combines traditional Vastu knowledge with astrological insights.',
    location: 'Gurugram',
    imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop',
    languages: ['Hindi', 'English'],
    rating: 4.6,
    reviewCount: 87,
    verified: true,
    experience: 22,
    categoryIds: ['4', '5'],
    services: ['5'],
  },
  {
    id: '5',
    name: 'Pandit Krishna Shastri',
    specialization: 'Wedding Ceremonies & Rituals',
    about: 'Pandit Krishna Shastri is a renowned expert in traditional wedding ceremonies.',
    location: 'Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop',
    languages: ['Hindi', 'Sanskrit', 'Tamil', 'English'],
    rating: 4.9,
    reviewCount: 142,
    verified: true,
    experience: 25,
    categoryIds: ['3'],
    services: [],
  },
];

const mockCategories: Category[] = [
  {
    id: '1',
    title: 'Home Ceremonies',
    description: 'Rituals for blessing and purifying homes',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    count: 8,
  },
  {
    id: '2',
    title: 'Child Ceremonies',
    description: 'Rituals for children including naming and first haircut',
    imageUrl: 'https://images.unsplash.com/photo-1555050455-f96634b5cba6?q=80&w=2033&auto=format&fit=crop',
    count: 6,
  },
  {
    id: '3',
    title: 'Wedding Ceremonies',
    description: 'Traditional Hindu wedding rituals',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop',
    count: 5,
  },
  {
    id: '4',
    title: 'Vastu & Consultation',
    description: 'Vastu analysis and remedies for homes and offices',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    count: 3,
  },
  {
    id: '5',
    title: 'Astrology',
    description: 'Horoscope reading, matchmaking, and remedies',
    imageUrl: 'https://images.unsplash.com/photo-1515894274780-af6262f1fcc2?q=80&w=2070&auto=format&fit=crop',
    count: 4,
  },
  {
    id: '6',
    title: 'Festival Pujas',
    description: 'Special pujas for festivals like Diwali, Navratri',
    imageUrl: 'https://images.unsplash.com/photo-1600093112291-7b553e3fcb82?q=80&w=2070&auto=format&fit=crop',
    count: 7,
  },
];

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
      services: mockServices,
      pandits: mockPandits,
      categories: mockCategories,
      isLoading: false,
      error: null,

      fetchServices: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ services: mockServices, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch services', isLoading: false });
        }
      },

      fetchPandits: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ pandits: mockPandits, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch pandits', isLoading: false });
        }
      },

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ categories: mockCategories, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch categories', isLoading: false });
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
