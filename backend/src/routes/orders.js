const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Создать заказ (публичный)
router.post('/', async (req, res) => {
  try {
    const { name, phone, city, pickupPoint, pickupAddress, items, total } = req.body;

    if (!name || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Заполните обязательные поля' });
    }

    const id = uuidv4();

    db.prepare(`
      INSERT INTO orders (id, customer_name, customer_phone, city, pickup_point, pickup_address, items, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, phone, city || null, pickupPoint || null, 
      pickupAddress || null, JSON.stringify(items), total
    );

    // Отправка в Telegram (если настроено)
    await sendTelegramNotification({ id, name, phone, city, pickupPoint, pickupAddress, items, total });

    res.status(201).json({ id, message: 'Заказ создан' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/orders - Получить все заказы (требует авторизации)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (customer_name LIKE ? OR customer_phone LIKE ? OR id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const orders = db.prepare(query).all(...params);

    // Подсчёт общего количества
    let countQuery = 'SELECT COUNT(*) as count FROM orders WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (customer_name LIKE ? OR customer_phone LIKE ? OR id LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const { count } = db.prepare(countQuery).get(...countParams);

    const formattedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items),
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      pickupPoint: o.pickup_point,
      pickupAddress: o.pickup_address,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));

    res.json({ orders: formattedOrders, total: count });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/orders/:id - Получить заказ по ID (требует авторизации)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    const formatted = {
      ...order,
      items: JSON.parse(order.items),
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      pickupPoint: order.pickup_point,
      pickupAddress: order.pickup_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    res.json(formatted);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/orders/:id/status - Обновить статус заказа (требует авторизации)
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }

    const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, id);

    res.json({ message: 'Статус обновлён' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/orders/:id - Удалить заказ (требует авторизации)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    db.prepare('DELETE FROM orders WHERE id = ?').run(id);

    res.json({ message: 'Заказ удалён' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Отправка уведомления в Telegram
async function sendTelegramNotification(order) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram не настроен, уведомление не отправлено');
    return;
  }

  try {
    const itemsList = order.items
      .map((item, i) => 
        `${i + 1}. ${item.name}${item.size ? ` (${item.size})` : ''} — ${item.quantity} шт. × ${item.price.toLocaleString('ru-RU')} ₽`
      )
      .join('\n');

    const message = `
🛍 *Новый заказ!*

👤 *Клиент:* ${escapeMarkdown(order.name)}
📱 *Телефон:* ${escapeMarkdown(order.phone)}

📍 *Доставка:*
Город: ${escapeMarkdown(order.city || 'Не указан')}
Пункт: ${escapeMarkdown(order.pickupPoint || 'Не указан')}
Адрес: ${escapeMarkdown(order.pickupAddress || 'Не указан')}

📦 *Состав заказа:*
${itemsList}

💰 *Итого:* ${order.total.toLocaleString('ru-RU')} ₽
    `.trim();

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

function escapeMarkdown(text) {
  if (!text) return '';
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

module.exports = router;
