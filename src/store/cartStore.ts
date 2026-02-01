import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.size === size
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1, size }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'vox-cart',
    }
  )
);
