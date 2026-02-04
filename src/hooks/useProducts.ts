import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { productsApi, useExternalApi } from '@/lib/api';
import { products as localProducts } from '@/data/products';

interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!useExternalApi) {
      // Локальный режим — используем статические данные
      let filtered = [...localProducts];
      
      if (options.category) {
        filtered = filtered.filter(p => p.category === options.category);
      }
      if (options.subcategory && options.subcategory !== 'all') {
        filtered = filtered.filter(p => p.subcategory === options.subcategory);
      }
      if (options.isNew) {
        filtered = filtered.filter(p => p.isNew);
      }
      if (options.isSale) {
        filtered = filtered.filter(p => p.isSale);
      }
      
      setProducts(filtered);
      setIsLoading(false);
      return;
    }

    // API режим
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productsApi.getAll({
        category: options.category,
        subcategory: options.subcategory,
        isNew: options.isNew,
        isSale: options.isSale,
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Ошибка загрузки товаров');
      // Fallback на локальные данные при ошибке API
      setProducts(localProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.subcategory, options.isNew, options.isSale]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!useExternalApi) {
        // Локальный режим
        const found = localProducts.find(p => p.id === id);
        setProduct(found || null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await productsApi.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Товар не найден');
        // Fallback
        const found = localProducts.find(p => p.id === id);
        setProduct(found || null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, isLoading, error };
}
