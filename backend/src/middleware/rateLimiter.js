const rateLimit = require('express-rate-limit');

// Rate limiter для логина: 5 попыток в минуту
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 5, // максимум 5 запросов
  message: { 
    error: 'Слишком много попыток входа. Попробуйте через минуту.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Не валидируем заголовки — trust proxy настроен в index.js
  validate: { xForwardedForHeader: false },
  keyGenerator: (req) => {
    // Используем IP + email для более точного ограничения
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  },
  skipSuccessfulRequests: false,
});

// Общий rate limiter для API: 100 запросов в минуту
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { 
    error: 'Слишком много запросов. Попробуйте позже.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

module.exports = { loginLimiter, apiLimiter };
