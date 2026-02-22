import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/mocks/products';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        if (!get().items.find(item => item.id === product.id)) {
          set({ items: [...get().items, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      isInWishlist: (productId) => get().items.some(item => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
