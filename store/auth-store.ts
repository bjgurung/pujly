import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'user' | 'pandit' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  role: UserRole;
  address?: string;
  location?: string;
  dob?: string;
  languages?: string[];
  expertise?: string[];
  bio?: string;
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isPandit: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isPandit: false,
      isAdmin: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const user: User = {
            id: '1',
            name: 'Demo User',
            email,
            role: 'user',
            location: 'Delhi NCR',
            createdAt: new Date().toISOString(),
          };
          set({
            user,
            isAuthenticated: true,
            isPandit: user.role === 'pandit',
            isAdmin: user.role === 'admin',
            isLoading: false,
          });
        } catch (e) {
          set({ error: 'Login failed. Please try again.', isLoading: false });
          throw e;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const user: User = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            createdAt: new Date().toISOString(),
          };
          set({
            user,
            isAuthenticated: true,
            isPandit: user.role === 'pandit',
            isAdmin: user.role === 'admin',
            isLoading: false,
          });
        } catch (e) {
          set({ error: 'Registration failed. Please try again.', isLoading: false });
          throw e;
        }
      },

      clearError: () => set({ error: null }),

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isPandit: false,
          isAdmin: false,
        });
      },

      updateUser: async (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...userData };
        set({
          user: updatedUser,
          isPandit: updatedUser.role === 'pandit',
          isAdmin: updatedUser.role === 'admin',
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
