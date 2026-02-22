import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cart-store';
import { trpcClient } from '@/lib/trpc';

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
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>, userId?: string) => string;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => string;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
  fetchOrders: (userId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addresses: [],

      addOrder: (orderData, userId) => {
        const id = `order_${Date.now()}`;
        const newOrder: Order = {
          ...orderData,
          id,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ orders: [newOrder, ...state.orders] }));

        if (userId) {
          trpcClient.data.createOrder.mutate({
            user_id: userId,
            items: JSON.stringify(orderData.items),
            total: orderData.total,
            address: JSON.stringify(orderData.address),
            payment_method: orderData.paymentMethod,
            status: orderData.status,
            estimated_delivery: orderData.estimatedDelivery,
          }).then(result => {
            if (result) {
              console.log('[Orders] Order saved to Supabase:', result.id);
              set(state => ({
                orders: state.orders.map(o =>
                  o.id === id ? { ...o, id: String(result.id) } : o
                ),
              }));
            }
          }).catch(e => {
            console.log('[Orders] Failed to save order to API:', e);
          });
        }

        return id;
      },

      getOrder: (id) => get().orders.find(o => o.id === id),

      cancelOrder: (id) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === id ? { ...o, status: 'cancelled' as const } : o
          ),
        }));
        trpcClient.data.updateOrderStatus.mutate({ id, status: 'cancelled' }).catch(e => {
          console.log('[Orders] Failed to cancel order via API:', e);
        });
      },

      fetchOrders: async (userId: string) => {
        try {
          const data = await trpcClient.data.getOrders.query({ userId });
          if (data && data.length > 0) {
            const mapped: Order[] = data.map((row: Record<string, unknown>) => ({
              id: String(row.id),
              items: typeof row.items === 'string' ? JSON.parse(row.items as string) : (row.items || []),
              total: Number(row.total) || 0,
              address: typeof row.address === 'string' ? JSON.parse(row.address as string) : (row.address || {}),
              paymentMethod: String(row.payment_method || ''),
              status: (row.status || 'pending') as Order['status'],
              createdAt: String(row.created_at || new Date().toISOString()),
              trackingId: row.tracking_id ? String(row.tracking_id) : undefined,
              estimatedDelivery: row.estimated_delivery ? String(row.estimated_delivery) : undefined,
            }));
            console.log('[Orders] Fetched', mapped.length, 'orders from API');
            set(state => {
              const localIds = new Set(state.orders.map(o => o.id));
              const newOrders = mapped.filter(o => !localIds.has(o.id));
              return { orders: [...newOrders, ...state.orders] };
            });
          }
        } catch (e) {
          console.log('[Orders] Failed to fetch orders:', e);
        }
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
