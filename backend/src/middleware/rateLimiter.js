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
  // Отключаем все валидации для совместимости с nginx proxy
  validate: false,
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
  // Отключаем все валидации для совместимости с nginx proxy
  validate: false,
});

module.exports = { loginLimiter, apiLimiter };
