import { Product, Category } from "@/types/product";

import dressBurgundy from "@/assets/products/dress-burgundy.jpg";
import corsetGold from "@/assets/products/corset-gold.jpg";
import dressRed from "@/assets/products/dress-red.jpg";

// New product images
import dressMini1 from "@/assets/products/dress-mini-1.jpg";
import dressMini2 from "@/assets/products/dress-mini-2.jpg";
import dressMini3 from "@/assets/products/dress-mini-3.jpg";
import dressMidi1 from "@/assets/products/dress-midi-1.jpg";
import dressMidi2 from "@/assets/products/dress-midi-2.jpg";
import dressMidi3 from "@/assets/products/dress-midi-3.jpg";
import dressMaxi1 from "@/assets/products/dress-maxi-1.jpg";
import dressMaxi2 from "@/assets/products/dress-maxi-2.jpg";
import dressMaxi3 from "@/assets/products/dress-maxi-3.jpg";
import corset1 from "@/assets/products/corset-1.jpg";
import corset2 from "@/assets/products/corset-2.jpg";
import corset3 from "@/assets/products/corset-3.jpg";
import skirt1 from "@/assets/products/skirt-1.jpg";
import skirt2 from "@/assets/products/skirt-2.jpg";
import skirt3 from "@/assets/products/skirt-3.jpg";
import pants1 from "@/assets/products/pants-1.jpg";
import pants2 from "@/assets/products/pants-2.jpg";
import pants3 from "@/assets/products/pants-3.jpg";
import jacket1 from "@/assets/products/jacket-1.jpg";
import jacket2 from "@/assets/products/jacket-2.jpg";
import jacket3 from "@/assets/products/jacket-3.jpg";
import blouse1 from "@/assets/products/blouse-1.jpg";
import blouse2 from "@/assets/products/blouse-2.jpg";
import blouse3 from "@/assets/products/blouse-3.jpg";
import suit1 from "@/assets/products/suit-1.jpg";
import suit2 from "@/assets/products/suit-2.jpg";
import suit3 from "@/assets/products/suit-3.jpg";
import accessory1 from "@/assets/products/accessory-1.jpg";
import accessory2 from "@/assets/products/accessory-2.jpg";
import accessory3 from "@/assets/products/accessory-3.jpg";

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
    image: skirt1,
  },
  {
    id: "4",
    name: "Шорты брюки",
    slug: "pants",
    image: pants1,
  },
  {
    id: "5",
    name: "Пиджаки жакеты",
    slug: "jackets",
    image: jacket1,
  },
  {
    id: "6",
    name: "Блузы сорочки",
    slug: "blouses",
    image: blouse1,
  },
  {
    id: "7",
    name: "Костюмы",
    slug: "suits",
    image: suit3,
  },
  {
    id: "8",
    name: "Верхняя одежда",
    slug: "outerwear",
    image: jacket2,
  },
  {
    id: "9",
    name: "Аксессуары",
    slug: "accessories",
    image: accessory1,
  },
];

export const products: Product[] = [
  // Dresses - Mini
  {
    id: "1",
    sku: "VOX-DR-001",
    name: "Платье мини бордо с воланами",
    price: 18500,
    image: dressMini1,
    category: "dresses",
    subcategory: "mini",
    color: "burgundy",
    isNew: true,
  },
  {
    id: "2",
    sku: "VOX-DR-002",
    name: "Платье мини чёрное атласное",
    price: 16200,
    image: dressMini2,
    category: "dresses",
    subcategory: "mini",
    color: "black",
  },
  {
    id: "3",
    sku: "VOX-DR-003",
    name: "Платье мини изумруд",
    price: 17800,
    oldPrice: 21500,
    image: dressMini3,
    category: "dresses",
    subcategory: "mini",
    color: "emerald",
    isSale: true,
  },
  // Dresses - Midi
  {
    id: "4",
    sku: "VOX-DR-004",
    name: "Платье миди шампань",
    price: 22500,
    image: dressMidi1,
    category: "dresses",
    subcategory: "midi",
    color: "cream",
    isNew: true,
  },
  {
    id: "5",
    sku: "VOX-DR-005",
    name: "Платье миди синий атлас",
    price: 24800,
    image: dressMidi2,
    category: "dresses",
    subcategory: "midi",
    color: "blue",
  },
  {
    id: "6",
    sku: "VOX-DR-006",
    name: "Платье миди пудра драпировка",
    price: 21900,
    image: dressMidi3,
    category: "dresses",
    subcategory: "midi",
    color: "pink",
  },
  // Dresses - Maxi
  {
    id: "7",
    sku: "VOX-DR-007",
    name: "Платье макси чёрное вечернее",
    price: 32500,
    image: dressMaxi1,
    category: "dresses",
    subcategory: "maxi",
    color: "black",
    isNew: true,
  },
  {
    id: "8",
    sku: "VOX-DR-008",
    name: "Платье макси изумруд шёлк",
    price: 35800,
    image: dressMaxi2,
    category: "dresses",
    subcategory: "maxi",
    color: "emerald",
  },
  {
    id: "9",
    sku: "VOX-DR-009",
    name: "Платье макси бордо русалка",
    price: 38900,
    oldPrice: 45000,
    image: dressMaxi3,
    category: "dresses",
    subcategory: "maxi",
    color: "burgundy",
    isSale: true,
  },
  // Corsets
  {
    id: "10",
    sku: "VOX-CR-001",
    name: "Корсет чёрный классика",
    price: 14200,
    image: corset1,
    category: "corsets",
    color: "black",
    isNew: true,
  },
  {
    id: "11",
    sku: "VOX-CR-002",
    name: "Корсет белый кружево",
    price: 15800,
    image: corset2,
    category: "corsets",
    color: "white",
  },
  {
    id: "12",
    sku: "VOX-CR-003",
    name: "Корсет бордо бархат",
    price: 16500,
    oldPrice: 19800,
    image: corset3,
    category: "corsets",
    color: "burgundy",
    isSale: true,
  },
  // Skirts
  {
    id: "13",
    sku: "VOX-SK-001",
    name: "Юбка чёрная атласная макси",
    price: 12800,
    image: skirt1,
    category: "skirts",
    isNew: true,
  },
  {
    id: "14",
    sku: "VOX-SK-002",
    name: "Юбка золотая плиссе",
    price: 14500,
    image: skirt2,
    category: "skirts",
  },
  {
    id: "15",
    sku: "VOX-SK-003",
    name: "Юбка изумруд шёлк",
    price: 13900,
    oldPrice: 16500,
    image: skirt3,
    category: "skirts",
    isSale: true,
  },
  // Pants
  {
    id: "16",
    sku: "VOX-PT-001",
    name: "Брюки палаццо чёрные",
    price: 15200,
    image: pants1,
    category: "pants",
    isNew: true,
  },
  {
    id: "17",
    sku: "VOX-PT-002",
    name: "Шорты золотой атлас",
    price: 9800,
    image: pants2,
    category: "pants",
  },
  {
    id: "18",
    sku: "VOX-PT-003",
    name: "Костюм бордо брючный",
    price: 28900,
    image: pants3,
    category: "pants",
  },
  // Jackets
  {
    id: "19",
    sku: "VOX-JK-001",
    name: "Пиджак чёрный оверсайз",
    price: 24500,
    image: jacket1,
    category: "jackets",
    isNew: true,
  },
  {
    id: "20",
    sku: "VOX-JK-002",
    name: "Жакет кремовый укороченный",
    price: 21800,
    image: jacket2,
    category: "jackets",
  },
  {
    id: "21",
    sku: "VOX-JK-003",
    name: "Пиджак бордо бархат",
    price: 26900,
    oldPrice: 32000,
    image: jacket3,
    category: "jackets",
    isSale: true,
  },
  // Blouses
  {
    id: "22",
    sku: "VOX-BL-001",
    name: "Блуза белая шёлк",
    price: 11500,
    image: blouse1,
    category: "blouses",
    isNew: true,
  },
  {
    id: "23",
    sku: "VOX-BL-002",
    name: "Блуза чёрная с бантом",
    price: 12800,
    image: blouse2,
    category: "blouses",
  },
  {
    id: "24",
    sku: "VOX-BL-003",
    name: "Блуза розовая органза",
    price: 13200,
    oldPrice: 15800,
    image: blouse3,
    category: "blouses",
    isSale: true,
  },
  // Suits
  {
    id: "25",
    sku: "VOX-ST-001",
    name: "Костюм чёрный классика",
    price: 42500,
    image: suit1,
    category: "suits",
    isNew: true,
  },
  {
    id: "26",
    sku: "VOX-ST-002",
    name: "Костюм кремовый лён",
    price: 38900,
    image: suit2,
    category: "suits",
  },
  {
    id: "27",
    sku: "VOX-ST-003",
    name: "Костюм бордо бархат",
    price: 45800,
    oldPrice: 52000,
    image: suit3,
    category: "suits",
    isSale: true,
  },
  // Accessories
  {
    id: "28",
    sku: "VOX-AC-001",
    name: "Серьги золотые солнце",
    price: 4500,
    image: accessory1,
    category: "accessories",
    isNew: true,
  },
  {
    id: "29",
    sku: "VOX-AC-002",
    name: "Клатч чёрный кожа",
    price: 8900,
    image: accessory2,
    category: "accessories",
  },
  {
    id: "30",
    sku: "VOX-AC-003",
    name: "Платок шёлковый",
    price: 5200,
    oldPrice: 6800,
    image: accessory3,
    category: "accessories",
    isSale: true,
  },
];
