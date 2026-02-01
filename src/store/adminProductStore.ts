import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { products as initialProducts, categories } from '@/data/products';

// SKU prefixes for each category
export const skuPrefixes: Record<string, string> = {
  dresses: 'DR',
  corsets: 'CR',
  skirts: 'SK',
  pants: 'PT',
  jackets: 'JK',
  blouses: 'BL',
  suits: 'ST',
  accessories: 'AC',
};

interface AdminProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getNextSku: (category: string) => string;
  getProductsByCategory: (category: string) => Product[];
}

export const useAdminProductStore = create<AdminProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,

      addProduct: (product) => {
        const products = get().products;
        const newId = String(Math.max(...products.map(p => parseInt(p.id))) + 1);
        set({
          products: [...products, { ...product, id: newId }],
        });
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id),
        });
      },

      getNextSku: (category) => {
        const prefix = skuPrefixes[category] || 'XX';
        const products = get().products.filter((p) => p.category === category);
        
        // Extract numbers from existing SKUs
        const existingNumbers = products
          .map((p) => {
            const match = p.sku.match(/VOX-[A-Z]{2}-(\d{3})/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter((n) => n > 0);

        // Find the next available number
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
    }
  )
);

// Export categories for admin use
export { categories };
