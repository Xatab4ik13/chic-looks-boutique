-- Скрипт для импорта начальных товаров в SQLite
-- Запустить на сервере: sqlite3 /path/to/database.db < seed-products.sql

-- Очистить таблицу перед импортом (опционально)
-- DELETE FROM products;

INSERT INTO products (id, sku, name, price, old_price, image, category, subcategory, color, is_new, is_sale) VALUES
-- Dresses - Mini
('1', 'VOX-DR-001', 'Платье мини бордо с воланами', 18500, NULL, '/assets/products/dress-mini-1.jpg', 'dresses', 'mini', 'burgundy', 1, 0),
('2', 'VOX-DR-002', 'Платье мини чёрное атласное', 16200, NULL, '/assets/products/dress-mini-2.jpg', 'dresses', 'mini', 'black', 0, 0),
('3', 'VOX-DR-003', 'Платье мини изумруд', 17800, 21500, '/assets/products/dress-mini-3.jpg', 'dresses', 'mini', 'emerald', 0, 1),

-- Dresses - Midi
('4', 'VOX-DR-004', 'Платье миди шампань', 22500, NULL, '/assets/products/dress-midi-1.jpg', 'dresses', 'midi', 'cream', 1, 0),
('5', 'VOX-DR-005', 'Платье миди синий атлас', 24800, NULL, '/assets/products/dress-midi-2.jpg', 'dresses', 'midi', 'blue', 0, 0),
('6', 'VOX-DR-006', 'Платье миди пудра драпировка', 21900, NULL, '/assets/products/dress-midi-3.jpg', 'dresses', 'midi', 'pink', 0, 0),

-- Dresses - Maxi
('7', 'VOX-DR-007', 'Платье макси чёрное вечернее', 32500, NULL, '/assets/products/dress-maxi-1.jpg', 'dresses', 'maxi', 'black', 1, 0),
('8', 'VOX-DR-008', 'Платье макси изумруд шёлк', 35800, NULL, '/assets/products/dress-maxi-2.jpg', 'dresses', 'maxi', 'emerald', 0, 0),
('9', 'VOX-DR-009', 'Платье макси бордо русалка', 38900, 45000, '/assets/products/dress-maxi-3.jpg', 'dresses', 'maxi', 'burgundy', 0, 1),

-- Corsets
('10', 'VOX-CR-001', 'Корсет чёрный классика', 14200, NULL, '/assets/products/corset-1.jpg', 'corsets', NULL, 'black', 1, 0),
('11', 'VOX-CR-002', 'Корсет белый кружево', 15800, NULL, '/assets/products/corset-2.jpg', 'corsets', NULL, 'white', 0, 0),
('12', 'VOX-CR-003', 'Корсет бордо бархат', 16500, 19800, '/assets/products/corset-3.jpg', 'corsets', NULL, 'burgundy', 0, 1),

-- Skirts
('13', 'VOX-SK-001', 'Юбка чёрная атласная макси', 12800, NULL, '/assets/products/skirt-1.jpg', 'skirts', NULL, NULL, 1, 0),
('14', 'VOX-SK-002', 'Юбка золотая плиссе', 14500, NULL, '/assets/products/skirt-2.jpg', 'skirts', NULL, NULL, 0, 0),
('15', 'VOX-SK-003', 'Юбка изумруд шёлк', 13900, 16500, '/assets/products/skirt-3.jpg', 'skirts', NULL, NULL, 0, 1),

-- Pants
('16', 'VOX-PT-001', 'Брюки палаццо чёрные', 15200, NULL, '/assets/products/pants-1.jpg', 'pants', NULL, NULL, 1, 0),
('17', 'VOX-PT-002', 'Шорты золотой атлас', 9800, NULL, '/assets/products/pants-2.jpg', 'pants', NULL, NULL, 0, 0),
('18', 'VOX-PT-003', 'Костюм бордо брючный', 28900, NULL, '/assets/products/pants-3.jpg', 'pants', NULL, NULL, 0, 0),

-- Jackets
('19', 'VOX-JK-001', 'Пиджак чёрный оверсайз', 24500, NULL, '/assets/products/jacket-1.jpg', 'jackets', NULL, NULL, 1, 0),
('20', 'VOX-JK-002', 'Жакет кремовый укороченный', 21800, NULL, '/assets/products/jacket-2.jpg', 'jackets', NULL, NULL, 0, 0),
('21', 'VOX-JK-003', 'Пиджак бордо бархат', 26900, 32000, '/assets/products/jacket-3.jpg', 'jackets', NULL, NULL, 0, 1),

-- Blouses
('22', 'VOX-BL-001', 'Блуза белая шёлк', 11500, NULL, '/assets/products/blouse-1.jpg', 'blouses', NULL, NULL, 1, 0),
('23', 'VOX-BL-002', 'Блуза чёрная с бантом', 12800, NULL, '/assets/products/blouse-2.jpg', 'blouses', NULL, NULL, 0, 0),
('24', 'VOX-BL-003', 'Блуза розовая органза', 13200, 15800, '/assets/products/blouse-3.jpg', 'blouses', NULL, NULL, 0, 1),

-- Suits
('25', 'VOX-ST-001', 'Костюм чёрный классика', 42500, NULL, '/assets/products/suit-1.jpg', 'suits', NULL, NULL, 1, 0),
('26', 'VOX-ST-002', 'Костюм кремовый лён', 38900, NULL, '/assets/products/suit-2.jpg', 'suits', NULL, NULL, 0, 0),
('27', 'VOX-ST-003', 'Костюм бордо бархат', 45800, 52000, '/assets/products/suit-3.jpg', 'suits', NULL, NULL, 0, 1),

-- Accessories
('28', 'VOX-AC-001', 'Серьги золотые солнце', 4500, NULL, '/assets/products/accessory-1.jpg', 'accessories', NULL, NULL, 1, 0),
('29', 'VOX-AC-002', 'Клатч чёрный кожа', 8900, NULL, '/assets/products/accessory-2.jpg', 'accessories', NULL, NULL, 0, 0),
('30', 'VOX-AC-003', 'Платок шёлковый', 5200, 6800, '/assets/products/accessory-3.jpg', 'accessories', NULL, NULL, 0, 1);
