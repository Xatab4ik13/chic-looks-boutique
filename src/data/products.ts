import { Product, Category } from "@/types/product";

import dressBurgundy from "@/assets/products/dress-burgundy.jpg";
import corsetGold from "@/assets/products/corset-gold.jpg";
import dressRed from "@/assets/products/dress-red.jpg";

export const categories: Category[] = [
  {
    id: "1",
    name: "Платья",
    slug: "dresses",
    image: dressBurgundy,
    subcategories: [
      { id: "1-1", name: "Все", slug: "all" },
      { id: "1-2", name: "Мини", slug: "mini" },
      { id: "1-3", name: "Миди", slug: "midi" },
      { id: "1-4", name: "Макси", slug: "maxi" },
    ],
  },
  {
    id: "2",
    name: "Корсеты",
    slug: "corsets",
    image: corsetGold,
  },
  {
    id: "3",
    name: "Юбки",
    slug: "skirts",
    image: dressBurgundy,
  },
  {
    id: "4",
    name: "Шорты и брюки",
    slug: "pants",
    image: dressRed,
  },
  {
    id: "5",
    name: "Пиджаки и жакеты",
    slug: "jackets",
    image: corsetGold,
  },
  {
    id: "6",
    name: "Блузы и сорочки",
    slug: "blouses",
    image: dressBurgundy,
  },
  {
    id: "7",
    name: "Костюмы",
    slug: "suits",
    image: dressRed,
  },
  {
    id: "8",
    name: "Аксессуары",
    slug: "accessories",
    image: corsetGold,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Платье с воланами бордо",
    price: 18500,
    image: dressBurgundy,
    category: "dresses",
    subcategory: "mini",
    isNew: true,
  },
  {
    id: "2",
    name: "Корсет золотой с рукавами",
    price: 14200,
    oldPrice: 16800,
    image: corsetGold,
    category: "corsets",
    isSale: true,
  },
  {
    id: "3",
    name: "Костюм красный атласный",
    price: 28900,
    image: dressRed,
    category: "suits",
    isNew: true,
  },
  {
    id: "4",
    name: "Платье вечернее бордо",
    price: 22500,
    image: dressBurgundy,
    category: "dresses",
    subcategory: "midi",
  },
  {
    id: "5",
    name: "Топ корсетный золотой",
    price: 12800,
    image: corsetGold,
    category: "corsets",
  },
  {
    id: "6",
    name: "Жакет красный шёлк",
    price: 19900,
    oldPrice: 24500,
    image: dressRed,
    category: "jackets",
    isSale: true,
  },
];
