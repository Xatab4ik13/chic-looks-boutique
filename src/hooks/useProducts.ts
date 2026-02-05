import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { productsApi, useExternalApi } from '@/lib/api';
import { products as localProducts } from '@/data/products';

interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  isNew?: boolean;
  isSale?: boolean;
  limit?: number;
  offset?: number;
}

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
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
      
      const totalCount = filtered.length;
      
      // Пагинация для локальных данных
      if (options.limit && options.limit > 0) {
        const offset = options.offset || 0;
        filtered = filtered.slice(offset, offset + options.limit);
      }
      
      setProducts(filtered);
      setTotal(totalCount);
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
        limit: options.limit,
        offset: options.offset,
      });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Ошибка загрузки товаров');
      // Fallback на локальные данные при ошибке API
      setProducts(localProducts);
      setTotal(localProducts.length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.subcategory, options.isNew, options.isSale, options.limit, options.offset]);

  return {
    products,
    total,
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
