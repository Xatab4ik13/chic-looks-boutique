export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
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
