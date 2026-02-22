import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingStatus } from '@/mocks/bookings';

const MOCK_BOOKINGS = [
  {
    id: '1',
    serviceId: '1',
    serviceTitle: 'Wedding Ceremony',
    panditId: 'p1',
    panditName: 'Pandit Ramesh Sharma',
    panditImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    userId: 'user1',
    date: '2026-03-20',
    time: '10:00 AM',
    duration: 180,
    location: 'Delhi, India',
    price: 15000,
    status: BookingStatus.CONFIRMED,
    paymentStatus: 'paid' as const,
    createdAt: '2026-02-10',
  },
  {
    id: '2',
    serviceId: '2',
    serviceTitle: 'House Warming Ceremony',
    panditId: 'p2',
    panditName: 'Pandit Suresh Patel',
    panditImageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
    userId: 'user1',
    date: '2026-03-25',
    time: '9:00 AM',
    duration: 120,
    location: 'Mumbai, India',
    price: 8000,
    status: BookingStatus.PENDING,
    paymentStatus: 'pending' as const,
    createdAt: '2026-02-12',
  },
  {
    id: '3',
    serviceId: '3',
    serviceTitle: 'Naming Ceremony',
    panditId: 'p3',
    panditName: 'Pandit Vijay Mishra',
    panditImageUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop',
    userId: 'user1',
    date: '2026-02-15',
    time: '11:00 AM',
    duration: 90,
    location: 'Bangalore, India',
    price: 5000,
    status: BookingStatus.COMPLETED,
    paymentStatus: 'paid' as const,
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    serviceId: '4',
    serviceTitle: 'Satyanarayan Puja',
    panditId: 'p4',
    panditName: 'Pandit Anil Kumar',
    panditImageUrl: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?q=80&w=1974&auto=format&fit=crop',
    userId: 'user1',
    date: '2026-02-18',
    time: '8:00 AM',
    duration: 150,
    location: 'Jaipur, India',
    price: 7500,
    status: BookingStatus.CANCELLED,
    paymentStatus: 'refunded' as const,
    createdAt: '2026-02-05',
  },
];

type BookingItem = typeof MOCK_BOOKINGS[0];

interface BookingsState {
  bookings: BookingItem[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  getBookingById: (id: string) => BookingItem | undefined;
  createBooking: (booking: Omit<BookingItem, 'id' | 'createdAt'>) => Promise<string>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: MOCK_BOOKINGS,
      isLoading: false,
      error: null,

      fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          set({ bookings: get().bookings.length > 0 ? get().bookings : MOCK_BOOKINGS, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch bookings', isLoading: false });
        }
      },

      getBookingById: (id) => get().bookings.find(b => b.id === id),

      createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newBooking = {
            ...bookingData,
            id: `booking-${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          set(state => ({
            bookings: [...state.bookings, newBooking],
            isLoading: false,
          }));
          return newBooking.id;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create booking', isLoading: false });
          throw error;
        }
      },

      updateBookingStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          set(state => ({
            bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update booking', isLoading: false });
          throw error;
        }
      },

      cancelBooking: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          set(state => ({
            bookings: state.bookings.map(b =>
              b.id === id ? { ...b, status: BookingStatus.CANCELLED, paymentStatus: 'refunded' as const } : b
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to cancel booking', isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'bookings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
