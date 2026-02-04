const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../database/init');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Вход админа
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);

    if (!admin) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const validPassword = bcrypt.compareSync(password, admin.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = generateToken({ id: admin.id, email: admin.email });

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/auth/me - Проверка текущего пользователя
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/change-password - Смена пароля
router.post('/change-password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 8 символов' });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.user.id);

    if (!admin) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const validPassword = bcrypt.compareSync(currentPassword, admin.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный текущий пароль' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
      .run(hashedPassword, req.user.id);

    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
