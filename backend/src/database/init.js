const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../data/vox.db');
const db = new Database(dbPath);

function initDatabase() {
  // Включаем foreign keys
  db.pragma('foreign_keys = ON');

  // Таблица категорий
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT,
      parent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // Таблица товаров
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      old_price INTEGER,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      color TEXT,
      color_variants TEXT,
      composition TEXT,
      available_sizes TEXT,
      is_new INTEGER DEFAULT 0,
      is_sale INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица заказов
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      city TEXT,
      pickup_point TEXT,
      pickup_address TEXT,
      items TEXT NOT NULL,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица админов
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Создаём дефолтного админа если его нет
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vox.ru';
  const adminPassword = process.env.ADMIN_PASSWORD || 'VoxAdmin2024!';
  
  const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);
  
  if (!existingAdmin) {
    const { v4: uuidv4 } = require('uuid');
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    
    db.prepare('INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)')
      .run(uuidv4(), adminEmail, hashedPassword);
    
    console.log(`✅ Создан админ: ${adminEmail}`);
  }

  // Создаём категории по умолчанию если их нет
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  
  if (categoryCount.count === 0) {
    seedCategories();
  }

  console.log('✅ База данных инициализирована');
}

function seedCategories() {
  const { v4: uuidv4 } = require('uuid');
  
  const categories = [
    { id: '1', name: 'Платья', slug: 'dresses' },
    { id: '2', name: 'Корсеты', slug: 'corsets' },
    { id: '3', name: 'Юбки', slug: 'skirts' },
    { id: '4', name: 'Шорты брюки', slug: 'pants' },
    { id: '5', name: 'Пиджаки жакеты', slug: 'jackets' },
    { id: '6', name: 'Блузы сорочки', slug: 'blouses' },
    { id: '7', name: 'Костюмы', slug: 'suits' },
    { id: '8', name: 'Верхняя одежда', slug: 'outerwear' },
    { id: '9', name: 'Аксессуары', slug: 'accessories' },
  ];

  const subcategories = [
    { id: '1-1', name: 'Все', slug: 'all', parent_id: '1' },
    { id: '1-2', name: 'Мини', slug: 'mini', parent_id: '1' },
    { id: '1-3', name: 'Миди', slug: 'midi', parent_id: '1' },
    { id: '1-4', name: 'Макси', slug: 'maxi', parent_id: '1' },
  ];

  const insertCategory = db.prepare(
    'INSERT INTO categories (id, name, slug, parent_id) VALUES (?, ?, ?, ?)'
  );

  for (const cat of categories) {
    insertCategory.run(cat.id, cat.name, cat.slug, null);
  }

  for (const sub of subcategories) {
    insertCategory.run(sub.id, sub.name, sub.slug, sub.parent_id);
  }

  console.log('✅ Категории созданы');
}

module.exports = { db, initDatabase };
