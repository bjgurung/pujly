import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingStatus } from '@/mocks/bookings';
import { trpcClient } from '@/lib/trpc';

interface BookingItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  panditId: string;
  panditName: string;
  panditImageUrl: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  price: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
}

const FALLBACK_BOOKINGS: BookingItem[] = [
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
];

function mapDbBooking(row: Record<string, unknown>): BookingItem {
  return {
    id: String(row.id),
    serviceId: String(row.service_id || row.serviceId || ''),
    serviceTitle: String(row.service_title || row.serviceTitle || ''),
    panditId: String(row.pandit_id || row.panditId || ''),
    panditName: String(row.pandit_name || row.panditName || ''),
    panditImageUrl: String(row.pandit_image_url || row.panditImageUrl || ''),
    userId: String(row.user_id || row.userId || ''),
    date: String(row.date || ''),
    time: String(row.time || ''),
    duration: Number(row.duration) || 0,
    location: String(row.location || ''),
    price: Number(row.price) || 0,
    status: (row.status as BookingStatus) || BookingStatus.PENDING,
    paymentStatus: (row.payment_status || row.paymentStatus || 'pending') as 'pending' | 'paid' | 'refunded' | 'failed',
    createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
  };
}

interface BookingsState {
  bookings: BookingItem[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: (userId?: string) => Promise<void>;
  getBookingById: (id: string) => BookingItem | undefined;
  createBooking: (booking: Omit<BookingItem, 'id' | 'createdAt'>) => Promise<string>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: FALLBACK_BOOKINGS,
      isLoading: false,
      error: null,

      fetchBookings: async (userId?: string) => {
        set({ isLoading: true, error: null });
        try {
          if (userId) {
            const data = await trpcClient.data.getBookings.query({ userId });
            if (data && data.length > 0) {
              const mapped = data.map((row: Record<string, unknown>) => mapDbBooking(row));
              console.log('[Bookings] Fetched', mapped.length, 'bookings from API');
              set({ bookings: mapped, isLoading: false });
              return;
            }
          }
          console.log('[Bookings] Using local data');
          set({ isLoading: false });
        } catch (e) {
          console.log('[Bookings] API error, using local data:', e);
          set({ isLoading: false });
        }
      },

      getBookingById: (id) => get().bookings.find(b => b.id === id),

      createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
          const result = await trpcClient.data.createBooking.mutate({
            service_id: bookingData.serviceId,
            service_title: bookingData.serviceTitle,
            pandit_id: bookingData.panditId,
            pandit_name: bookingData.panditName,
            pandit_image_url: bookingData.panditImageUrl,
            user_id: bookingData.userId,
            date: bookingData.date,
            time: bookingData.time,
            duration: bookingData.duration,
            location: bookingData.location,
            price: bookingData.price,
            status: bookingData.status,
            payment_status: bookingData.paymentStatus,
          });

          if (result) {
            const mapped = mapDbBooking(result as Record<string, unknown>);
            set(state => ({
              bookings: [...state.bookings, mapped],
              isLoading: false,
            }));
            console.log('[Bookings] Created booking:', mapped.id);
            return mapped.id;
          }
          throw new Error('No result from API');
        } catch (e) {
          console.log('[Bookings] API create error, creating locally:', e);
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
        }
      },

      updateBookingStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          await trpcClient.data.updateBookingStatus.mutate({ id, status });
          console.log('[Bookings] Updated booking status via API:', id, status);
        } catch (e) {
          console.log('[Bookings] API update error, updating locally:', e);
        }
        set(state => ({
          bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b),
          isLoading: false,
        }));
      },

      cancelBooking: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await trpcClient.data.updateBookingStatus.mutate({
            id,
            status: BookingStatus.CANCELLED,
            payment_status: 'refunded',
          });
          console.log('[Bookings] Cancelled booking via API:', id);
        } catch (e) {
          console.log('[Bookings] API cancel error, cancelling locally:', e);
        }
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === id ? { ...b, status: BookingStatus.CANCELLED, paymentStatus: 'refunded' as const } : b
          ),
          isLoading: false,
        }));
      },
    }),
    {
      name: 'bookings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
