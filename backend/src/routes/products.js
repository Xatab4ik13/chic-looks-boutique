const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Папка uploads
const uploadDir = path.join(__dirname, '../../uploads');

// Функция для извлечения имён файлов из URL изображений
const extractFilenamesFromProduct = (product) => {
  const filenames = [];
  
  // Основное изображение
  if (product.image && product.image.startsWith('/uploads/')) {
    filenames.push(product.image.replace('/uploads/', ''));
  }
  
  // Изображения из colorVariants
  if (product.color_variants) {
    try {
      const variants = typeof product.color_variants === 'string' 
        ? JSON.parse(product.color_variants) 
        : product.color_variants;
      
      variants.forEach(variant => {
        // Legacy single image
        if (variant.image && variant.image.startsWith('/uploads/')) {
          filenames.push(variant.image.replace('/uploads/', ''));
        }
        // Multiple images
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach(img => {
            if (img && img.startsWith('/uploads/')) {
              filenames.push(img.replace('/uploads/', ''));
            }
          });
        }
      });
    } catch (e) {
      console.error('Error parsing color_variants:', e);
    }
  }
  
  return [...new Set(filenames)]; // Убираем дубликаты
};

// Функция для удаления файла
const deleteFile = (filename) => {
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filename}`);
      return true;
    } catch (err) {
      console.error(`Error deleting file ${filename}:`, err);
      return false;
    }
  }
  return false;
};

// GET /api/products - Получить все товары
router.get('/', (req, res) => {
  try {
    const { category, subcategory, search, isNew, isSale } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (subcategory && subcategory !== 'all') {
      query += ' AND subcategory = ?';
      params.push(subcategory);
    }

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (isNew === 'true') {
      query += ' AND is_new = 1';
    }

    if (isSale === 'true') {
      query += ' AND is_sale = 1';
    }

    query += ' ORDER BY created_at DESC';

    const products = db.prepare(query).all(...params);

    // Преобразуем JSON поля
    const formattedProducts = products.map(p => ({
      ...p,
      colorVariants: p.color_variants ? JSON.parse(p.color_variants) : undefined,
      availableSizes: p.available_sizes ? JSON.parse(p.available_sizes) : undefined,
      oldPrice: p.old_price,
      isNew: Boolean(p.is_new),
      isSale: Boolean(p.is_sale),
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/products/:id - Получить товар по ID
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    const formatted = {
      ...product,
      colorVariants: product.color_variants ? JSON.parse(product.color_variants) : undefined,
      availableSizes: product.available_sizes ? JSON.parse(product.available_sizes) : undefined,
      oldPrice: product.old_price,
      isNew: Boolean(product.is_new),
      isSale: Boolean(product.is_sale),
    };

    res.json(formatted);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/products - Создать товар (требует авторизации)
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      sku, name, price, oldPrice, image, category, subcategory,
      color, colorVariants, composition, availableSizes, isNew, isSale
    } = req.body;

    if (!sku || !name || !price || !image || !category) {
      return res.status(400).json({ error: 'Заполните обязательные поля' });
    }

    // Проверяем уникальность SKU
    const existingSku = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku);
    if (existingSku) {
      return res.status(400).json({ error: 'Товар с таким артикулом уже существует' });
    }

    const id = uuidv4();

    db.prepare(`
      INSERT INTO products (
        id, sku, name, price, old_price, image, category, subcategory,
        color, color_variants, composition, available_sizes, is_new, is_sale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, sku, name, price, oldPrice || null, image, category, subcategory || null,
      color || null, colorVariants ? JSON.stringify(colorVariants) : null,
      composition || null, availableSizes ? JSON.stringify(availableSizes) : null,
      isNew ? 1 : 0, isSale ? 1 : 0
    );

    res.status(201).json({ id, message: 'Товар создан' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/products/:id - Обновить товар (требует авторизации)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku, name, price, oldPrice, image, category, subcategory,
      color, colorVariants, composition, availableSizes, isNew, isSale
    } = req.body;

    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Проверяем уникальность SKU (кроме текущего товара)
    const existingSku = db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(sku, id);
    if (existingSku) {
      return res.status(400).json({ error: 'Товар с таким артикулом уже существует' });
    }

    db.prepare(`
      UPDATE products SET
        sku = ?, name = ?, price = ?, old_price = ?, image = ?,
        category = ?, subcategory = ?, color = ?, color_variants = ?,
        composition = ?, available_sizes = ?, is_new = ?, is_sale = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      sku, name, price, oldPrice || null, image, category, subcategory || null,
      color || null, colorVariants ? JSON.stringify(colorVariants) : null,
      composition || null, availableSizes ? JSON.stringify(availableSizes) : null,
      isNew ? 1 : 0, isSale ? 1 : 0, id
    );

    res.json({ message: 'Товар обновлён' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/products/:id - Удалить товар (требует авторизации)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Извлекаем и удаляем все связанные файлы изображений
    const filenames = extractFilenamesFromProduct(existing);
    let deletedCount = 0;
    filenames.forEach(filename => {
      if (deleteFile(filename)) {
        deletedCount++;
      }
    });

    // Удаляем запись из базы
    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    console.log(`Product ${id} deleted with ${deletedCount}/${filenames.length} image files`);
    res.json({ 
      message: 'Товар удалён',
      deletedImages: deletedCount 
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/products/next-sku/:category - Получить следующий SKU
router.get('/next-sku/:category', authenticateToken, (req, res) => {
  try {
    const { category } = req.params;
    
    const skuPrefixes = {
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

    const prefix = skuPrefixes[category] || 'XX';

    const products = db.prepare(
      'SELECT sku FROM products WHERE category = ?'
    ).all(category);

    const numbers = products
      .map(p => {
        const match = p.sku.match(/VOX-[A-Z]{2}-(\d{3})/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = String(maxNumber + 1).padStart(3, '0');

    res.json({ sku: `VOX-${prefix}-${nextNumber}` });
  } catch (error) {
    console.error('Get next SKU error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
