import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

let trpcClientRef: any = null;

export const setTrpcClientRef = (client: any) => {
  trpcClientRef = client;
  console.log('[Auth] tRPC client ref set');
};

const getTrpcClient = () => {
  if (!trpcClientRef) {
    try {
      const { trpcClient } = require('@/lib/trpc');
      trpcClientRef = trpcClient;
    } catch (e) {
      console.error('[Auth] Failed to load trpc client:', e);
    }
  }
  return trpcClientRef;
};

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
  token: string | null;
  isAuthenticated: boolean;
  isPandit: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string; role: UserRole }) => Promise<void>;
  googleSignIn: (accessToken: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isPandit: false,
      isAdmin: false,
      isLoading: false,
      isHydrated: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const client = getTrpcClient();
          if (!client) throw new Error('API client not available');
          const result = await client.auth.emailLogin.mutate({ email, password });
          console.log('[Auth] Login success:', result.user.email);
          const user: User = {
            ...result.user,
            location: 'Delhi NCR',
          };
          set({
            user,
            token: result.token,
            isAuthenticated: true,
            isPandit: user.role === 'pandit',
            isAdmin: user.role === 'admin',
            isLoading: false,
            isHydrated: true,
          });
        } catch (e) {
          console.error('[Auth] Login failed:', e);
          set({ error: 'Login failed. Please try again.', isLoading: false });
          throw e;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const client = getTrpcClient();
          if (!client) throw new Error('API client not available');
          const result = await client.auth.emailRegister.mutate({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role,
          });
          console.log('[Auth] Register success:', result.user.email);
          const user: User = {
            ...result.user,
            phone: data.phone,
            location: 'Delhi NCR',
          };
          set({
            user,
            token: result.token,
            isAuthenticated: true,
            isPandit: user.role === 'pandit',
            isAdmin: user.role === 'admin',
            isLoading: false,
            isHydrated: true,
          });
        } catch (e) {
          console.error('[Auth] Registration failed:', e);
          set({ error: 'Registration failed. Please try again.', isLoading: false });
          throw e;
        }
      },

      googleSignIn: async (accessToken: string, role: UserRole = 'user') => {
        set({ isLoading: true, error: null });
        try {
          const client = getTrpcClient();
          if (!client) throw new Error('API client not available');
          const result = await client.auth.googleSignIn.mutate({
            accessToken,
            role,
          });
          console.log('[Auth] Google sign-in success:', result.user.email);
          const user: User = {
            ...result.user,
            location: 'Delhi NCR',
          };
          set({
            user,
            token: result.token,
            isAuthenticated: true,
            isPandit: user.role === 'pandit',
            isAdmin: user.role === 'admin',
            isLoading: false,
            isHydrated: true,
          });
        } catch (e) {
          console.error('[Auth] Google sign-in failed:', e);
          set({ error: 'Google sign-in failed. Please try again.', isLoading: false });
          throw e;
        }
      },

      clearError: () => set({ error: null }),

      logout: () => {
        console.log('[Auth] Logging out');
        set({
          user: null,
          token: null,
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
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isPandit: state.isPandit,
        isAdmin: state.isAdmin,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[Auth] Rehydration error:', error);
        }
        console.log('[Auth] Rehydrated, isAuthenticated:', state?.isAuthenticated);
        useAuthStore.setState({ isHydrated: true });
      },
    }
  )
);
