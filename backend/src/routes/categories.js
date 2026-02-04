const express = require('express');
const { db } = require('../database/init');

const router = express.Router();

// GET /api/categories - Получить все категории
router.get('/', (req, res) => {
  try {
    // Получаем основные категории
    const mainCategories = db.prepare(
      'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id'
    ).all();

    // Получаем подкатегории
    const subcategories = db.prepare(
      'SELECT * FROM categories WHERE parent_id IS NOT NULL ORDER BY id'
    ).all();

    // Формируем структуру с подкатегориями
    const categoriesWithSubs = mainCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      subcategories: subcategories
        .filter(sub => sub.parent_id === cat.id)
        .map(sub => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
        })),
    }));

    res.json(categoriesWithSubs);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
