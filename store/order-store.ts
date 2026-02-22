import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cart-store';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingId?: string;
  estimatedDelivery?: string;
}

interface OrderState {
  orders: Order[];
  addresses: Address[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => string;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addresses: [],

      addOrder: (orderData) => {
        const id = `order_${Date.now()}`;
        const newOrder: Order = {
          ...orderData,
          id,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ orders: [newOrder, ...state.orders] }));
        return id;
      },

      getOrder: (id) => get().orders.find(o => o.id === id),

      cancelOrder: (id) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === id ? { ...o, status: 'cancelled' as const } : o
          ),
        }));
      },

      addAddress: (addressData) => {
        const id = `address_${Date.now()}`;
        const newAddress: Address = {
          ...addressData,
          id,
          isDefault: get().addresses.length === 0 ? true : addressData.isDefault,
        };
        set(state => {
          const updatedAddresses = newAddress.isDefault
            ? state.addresses.map(addr => ({ ...addr, isDefault: false }))
            : [...state.addresses];
          return { addresses: [...updatedAddresses, newAddress] };
        });
        return id;
      },

      updateAddress: (address) => {
        set(state => {
          const updatedAddresses = address.isDefault
            ? state.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === address.id,
              }))
            : state.addresses.map(addr =>
                addr.id === address.id ? address : addr
              );
          return { addresses: updatedAddresses };
        });
      },

      removeAddress: (id) => {
        const addressToRemove = get().addresses.find(addr => addr.id === id);
        set(state => ({
          addresses: state.addresses.filter(addr => addr.id !== id),
        }));
        if (addressToRemove?.isDefault && get().addresses.length > 0) {
          get().setDefaultAddress(get().addresses[0].id);
        }
      },

      setDefaultAddress: (id) => {
        set(state => ({
          addresses: state.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      getDefaultAddress: () => get().addresses.find(addr => addr.isDefault),
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
