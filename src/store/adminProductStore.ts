import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { products as initialProducts, categories } from '@/data/products';
import { productsApi, useExternalApi } from '@/lib/api';

// SKU prefixes for each category
export const skuPrefixes: Record<string, string> = {
  dresses: 'DR',
  corsets: 'CR',
  skirts: 'SK',
  pants: 'PT',
  jackets: 'JK',
  blouses: 'BL',
  suits: 'ST',
  outerwear: 'OW',
  accessories: 'AC',
};

interface AdminProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getNextSku: (category: string) => Promise<string>;
  getProductsByCategory: (category: string) => Product[];
}

export const useAdminProductStore = create<AdminProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        if (!useExternalApi) return;
        
        set({ isLoading: true, error: null });
        try {
          const products = await productsApi.getAll();
          set({ products, isLoading: false });
        } catch (error) {
          console.error('Fetch products error:', error);
          set({ error: 'Ошибка загрузки товаров', isLoading: false });
        }
      },

      addProduct: async (product) => {
        set({ isLoading: true, error: null });
        
        try {
          if (useExternalApi) {
            const result = await productsApi.create(product);
            const newProduct = { ...product, id: result.id };
            set(state => ({
              products: [...state.products, newProduct],
              isLoading: false,
            }));
          } else {
            // Локальный режим
            const products = get().products;
            const newId = String(Math.max(...products.map(p => parseInt(p.id) || 0), 0) + 1);
            set({
              products: [...products, { ...product, id: newId }],
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Add product error:', error);
          set({ error: 'Ошибка добавления товара', isLoading: false });
          throw error;
        }
      },

      updateProduct: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          if (useExternalApi) {
            await productsApi.update(id, updates);
          }
          
          set(state => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Update product error:', error);
          set({ error: 'Ошибка обновления товара', isLoading: false });
          throw error;
        }
      },

      deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          if (useExternalApi) {
            await productsApi.delete(id);
          }
          
          set(state => ({
            products: state.products.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Delete product error:', error);
          set({ error: 'Ошибка удаления товара', isLoading: false });
          throw error;
        }
      },

      getNextSku: async (category) => {
        if (useExternalApi) {
          try {
            const result = await productsApi.getNextSku(category);
            return result.sku;
          } catch {
            // Fallback to local calculation
          }
        }

        // Локальный расчёт
        const prefix = skuPrefixes[category] || 'XX';
        const products = get().products.filter((p) => p.category === category);
        
        const existingNumbers = products
          .map((p) => {
            const match = p.sku.match(/VOX-[A-Z]{2}-(\d{3})/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter((n) => n > 0);

        const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
        const nextNumber = String(maxNumber + 1).padStart(3, '0');
        
        return `VOX-${prefix}-${nextNumber}`;
      },

      getProductsByCategory: (category) => {
        return get().products.filter((p) => p.category === category);
      },
    }),
    {
      name: 'vox-admin-products',
      // Не сохраняем products если используем внешний API
      partialize: (state) => useExternalApi 
        ? {} 
        : { products: state.products },
    }
  )
);

// Export categories for admin use
export { categories };
