export type ProductColor = 
  | "black" 
  | "white" 
  | "red" 
  | "burgundy" 
  | "pink" 
  | "blue" 
  | "navy" 
  | "green" 
  | "emerald" 
  | "beige" 
  | "cream" 
  | "gold" 
  | "silver" 
  | "brown" 
  | "gray";

export const productColors: { value: ProductColor; label: string; hex: string }[] = [
  { value: "black", label: "Чёрный", hex: "#1a1a1a" },
  { value: "white", label: "Белый", hex: "#ffffff" },
  { value: "red", label: "Красный", hex: "#dc2626" },
  { value: "burgundy", label: "Бордо", hex: "#7c2d12" },
  { value: "pink", label: "Розовый", hex: "#ec4899" },
  { value: "blue", label: "Синий", hex: "#2563eb" },
  { value: "navy", label: "Тёмно-синий", hex: "#1e3a5f" },
  { value: "green", label: "Зелёный", hex: "#16a34a" },
  { value: "emerald", label: "Изумруд", hex: "#047857" },
  { value: "beige", label: "Бежевый", hex: "#d4b896" },
  { value: "cream", label: "Кремовый", hex: "#f5f5dc" },
  { value: "gold", label: "Золотой", hex: "#d4af37" },
  { value: "silver", label: "Серебряный", hex: "#c0c0c0" },
  { value: "brown", label: "Коричневый", hex: "#8b4513" },
  { value: "gray", label: "Серый", hex: "#6b7280" },
];

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  color?: ProductColor;
  isNew?: boolean;
  isSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}
