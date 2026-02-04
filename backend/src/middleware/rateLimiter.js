const rateLimit = require('express-rate-limit');

// Rate limiter для логина: 5 попыток в минуту
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 5, // максимум 5 запросов
  message: { 
    error: 'Слишком много попыток входа. Попробуйте через минуту.' 
  },
  standardHeaders: true, // Возвращает rate limit info в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключает `X-RateLimit-*` заголовки
  keyGenerator: (req) => {
    // Используем IP + email для более точного ограничения
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  },
  skipSuccessfulRequests: false, // Считаем все запросы
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
});

module.exports = { loginLimiter, apiLimiter };
