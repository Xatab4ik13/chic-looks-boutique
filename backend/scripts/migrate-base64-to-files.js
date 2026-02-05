/**
 * Скрипт миграции: конвертирует base64 изображения в файлы /uploads/
 * и обновляет записи в БД на URL
 * 
 * Запуск: cd /var/www/chic-looks-boutique/backend && node scripts/migrate-base64-to-files.js
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Пути
const DB_PATH = path.join(__dirname, '../data/vox.db');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Создаём папку uploads если её нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('✓ Создана папка uploads');
}

// Подключаемся к БД
const db = new Database(DB_PATH);
console.log('✓ Подключено к БД:', DB_PATH);

// Получаем все товары
const products = db.prepare('SELECT id, sku, image, color_variants FROM products').all();
console.log(`\n📦 Найдено товаров: ${products.length}`);

let migratedCount = 0;
let filesCreated = 0;

/**
 * Конвертирует base64 в файл и возвращает URL
 */
function base64ToFile(base64String, sku, suffix = '') {
  if (!base64String || !base64String.startsWith('data:image')) {
    return base64String; // Уже URL или пусто
  }

  try {
    // Извлекаем формат и данные
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      console.warn(`  ⚠ Не удалось распарсить base64 для ${sku}${suffix}`);
      return base64String;
    }

    const format = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Генерируем уникальное имя файла
    const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
    const filename = `${sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}${suffix}-${hash}.${format}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Проверяем, не существует ли уже такой файл
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, buffer);
      filesCreated++;
      console.log(`  ✓ Создан файл: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
    } else {
      console.log(`  ○ Файл уже существует: ${filename}`);
    }

    // Возвращаем URL (абсолютный для продакшена)
    return `https://api.voxbrand.ru/uploads/${filename}`;
  } catch (err) {
    console.error(`  ✗ Ошибка конвертации для ${sku}${suffix}:`, err.message);
    return base64String;
  }
}

// Обрабатываем каждый товар
for (const product of products) {
  console.log(`\n📌 ${product.sku}: ${product.id}`);
  
  let updated = false;
  let newImage = product.image;
  let newColorVariants = product.color_variants;

  // 1. Основное изображение
  if (product.image && product.image.startsWith('data:image')) {
    newImage = base64ToFile(product.image, product.sku, '-main');
    updated = true;
  }

  // 2. Цветовые варианты
  if (product.color_variants) {
    try {
      const variants = JSON.parse(product.color_variants);
      let variantsUpdated = false;

      variants.forEach((variant, vIndex) => {
        // Старый формат: одно изображение
        if (variant.image && variant.image.startsWith('data:image')) {
          variant.image = base64ToFile(variant.image, product.sku, `-v${vIndex}`);
          variantsUpdated = true;
        }

        // Новый формат: массив изображений
        if (variant.images && Array.isArray(variant.images)) {
          variant.images = variant.images.map((img, imgIndex) => {
            if (img && img.startsWith('data:image')) {
              variantsUpdated = true;
              return base64ToFile(img, product.sku, `-v${vIndex}-${imgIndex}`);
            }
            return img;
          });
        }
      });

      if (variantsUpdated) {
        newColorVariants = JSON.stringify(variants);
        updated = true;
      }
    } catch (err) {
      console.error(`  ✗ Ошибка парсинга color_variants:`, err.message);
    }
  }

  // 3. Обновляем БД
  if (updated) {
    db.prepare(`
      UPDATE products 
      SET image = ?, color_variants = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(newImage, newColorVariants, product.id);
    migratedCount++;
    console.log(`  ✓ БД обновлена`);
  } else {
    console.log(`  ○ Миграция не требуется (уже URL)`);
  }
}

// Итоги
console.log('\n' + '='.repeat(50));
console.log('📊 ИТОГИ МИГРАЦИИ:');
console.log(`   Товаров обработано: ${products.length}`);
console.log(`   Товаров мигрировано: ${migratedCount}`);
console.log(`   Файлов создано: ${filesCreated}`);
console.log('='.repeat(50));

// Проверка размера ответа после миграции
const testProducts = db.prepare('SELECT id, image FROM products LIMIT 5').all();
const avgImageLength = testProducts.reduce((sum, p) => sum + (p.image?.length || 0), 0) / testProducts.length;
console.log(`\n✓ Средняя длина поля image: ${Math.round(avgImageLength)} символов`);

if (avgImageLength > 500) {
  console.log('⚠ ВНИМАНИЕ: Возможно остались base64 изображения!');
} else {
  console.log('✓ Все изображения теперь хранятся как URL');
}

db.close();
console.log('\n✓ Миграция завершена!\n');
