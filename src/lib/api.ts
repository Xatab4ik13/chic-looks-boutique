// API клиент для Node.js бэкенда
// Если VITE_API_URL не установлен, используется Lovable Cloud (Supabase)

function resolveApiUrl(): string {
  // 1) Явно задано при сборке (приоритетно)
  const fromEnv = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();

  // 2) Fallback для прод-домена: если открыли voxbrand.ru, то API на api.voxbrand.ru
  // Это спасает от ситуаций, когда .env не подхватился при сборке.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "voxbrand.ru" || host.endsWith(".voxbrand.ru")) {
      return "https://api.voxbrand.ru";
    }
  }

  return "";
}

const API_URL = resolveApiUrl();

// Используется ли внешний API
export const useExternalApi = !!API_URL;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const token = localStorage.getItem('vox-admin-token');
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const result = await request<{ token: string; user: { id: string; email: string } }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    localStorage.setItem('vox-admin-token', result.token);
    return result;
  },

  logout: () => {
    localStorage.removeItem('vox-admin-token');
  },

  checkAuth: async () => {
    try {
      return await request<{ user: { id: string; email: string } }>('/api/auth/me');
    } catch {
      localStorage.removeItem('vox-admin-token');
      return null;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return request<{ message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: {
    category?: string;
    subcategory?: string;
    search?: string;
    isNew?: boolean;
    isSale?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.isNew) searchParams.set('isNew', 'true');
    if (params?.isSale) searchParams.set('isSale', 'true');
    
    const query = searchParams.toString();
    return request<Product[]>(`/api/products${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return request<Product>(`/api/products/${id}`);
  },

  create: async (product: Omit<Product, 'id'>) => {
    return request<{ id: string; message: string }>('/api/products', {
      method: 'POST',
      body: product,
    });
  },

  update: async (id: string, product: Partial<Product>) => {
    return request<{ message: string }>(`/api/products/${id}`, {
      method: 'PUT',
      body: product,
    });
  },

  delete: async (id: string) => {
    return request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  getNextSku: async (category: string) => {
    return request<{ sku: string }>(`/api/products/next-sku/${category}`);
  },
};

// Orders API
export const ordersApi = {
  create: async (order: {
    name: string;
    phone: string;
    city?: string;
    pickupPoint?: string;
    pickupAddress?: string;
    items: Array<{
      name: string;
      size?: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  }) => {
    return request<{ id: string; message: string }>('/api/orders', {
      method: 'POST',
      body: order,
    });
  },

  getAll: async (params?: { status?: string; search?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    
    const query = searchParams.toString();
    return request<{ orders: Order[]; total: number }>(`/api/orders${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return request<Order>(`/api/orders/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return request<{ message: string }>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  delete: async (id: string) => {
    return request<{ message: string }>(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    return request<Category[]>('/api/categories');
  },
};

// Upload API
export const uploadApi = {
  uploadBase64: async (image: string, filename?: string) => {
    return request<{ url: string; filename: string }>('/api/upload/base64', {
      method: 'POST',
      body: { image, filename },
    });
  },
};

// Types
import { Product, Category } from '@/types/product';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  city?: string;
  pickupPoint?: string;
  pickupAddress?: string;
  items: Array<{
    name: string;
    size?: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
