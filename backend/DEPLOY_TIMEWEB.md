# VOX Backend — Деплой на TimeWeb VPS

## 📋 Данные проекта

| Параметр | Значение |
|----------|----------|
| **Домен** | voxbrand.ru |
| **API домен** | api.voxbrand.ru |
| **Логин админа** | voxshop |
| **Пароль админа** | vox360811632! |
| **JWT Secret** | Vx$8kL2mN9pQ3rT6wY1zA4cF7gH0jK5nM2oP8sU |

---

## Шаг 1: Подключение к серверу

```bash
ssh root@ВАШ_IP_АДРЕС
```

---

## Шаг 2: Установка Node.js 20 и зависимостей

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Проверка
node -v  # должно показать v20.x.x

# Установка инструментов
apt install -y git build-essential python3 nginx certbot python3-certbot-nginx
npm install -g pm2
```

---

## Шаг 3: Загрузка проекта

```bash
mkdir -p /var/www
cd /var/www

# Клонируйте ваш репозиторий
git clone https://github.com/ВАШ_РЕПОЗИТОРИЙ.git vox-shop
cd vox-shop/backend

# Установка зависимостей
npm install
```

---

## Шаг 4: Создание .env файла

```bash
nano .env
```

Вставьте этот конфиг:

```env
# Порт сервера
PORT=3001

# JWT секретный ключ
JWT_SECRET=Vx$8kL2mN9pQ3rT6wY1zA4cF7gH0jK5nM2oP8sU

# Админ
ADMIN_EMAIL=voxshop
ADMIN_PASSWORD=vox360811632!

# URL фронтенда для CORS
FRONTEND_URL=https://voxbrand.ru

# Telegram Bot (заполните для уведомлений о заказах)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Сохраните: `Ctrl+X`, затем `Y`, затем `Enter`

---

## Шаг 5: Создание папок и запуск

```bash
# Папки для данных
mkdir -p data uploads
chmod 755 data uploads

# Запуск через PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Выполните команду которую покажет PM2

# Проверка
pm2 status
pm2 logs vox-backend
```

---

## Шаг 6: Настройка DNS

В панели управления доменом voxbrand.ru добавьте A-запись:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | api | ВАШ_IP_СЕРВЕРА |

Подождите 5-15 минут для применения.

---

## Шаг 7: Настройка Nginx

```bash
nano /etc/nginx/sites-available/api.voxbrand.ru
```

Вставьте:

```nginx
server {
    listen 80;
    server_name api.voxbrand.ru;

    client_max_body_size 50M;

    # Логи
    access_log /var/log/nginx/vox-api-access.log;
    error_log /var/log/nginx/vox-api-error.log;

    # Загруженные файлы
    location /uploads/ {
        alias /var/www/vox-shop/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API проксирование
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:

```bash
ln -s /etc/nginx/sites-available/api.voxbrand.ru /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Шаг 8: SSL сертификат

```bash
certbot --nginx -d api.voxbrand.ru
```

Введите email и согласитесь с условиями.

---

## Шаг 9: Настройка фронтенда

В Lovable проекте добавьте переменную окружения:

```
VITE_API_URL=https://api.voxbrand.ru
```

Или создайте `.env` файл в корне фронтенда:

```env
VITE_API_URL=https://api.voxbrand.ru
```

После этого пересоберите и задеплойте фронтенд.

---

## Проверка работы

1. **API**: https://api.voxbrand.ru/api/categories — должен вернуть JSON
2. **Админка**: https://voxbrand.ru/admin/login
3. **Вход**: логин `voxshop`, пароль `vox360811632!`

---

## Полезные команды

### PM2
```bash
pm2 status              # Статус
pm2 logs vox-backend    # Логи
pm2 restart vox-backend # Перезапуск
pm2 stop vox-backend    # Остановка
```

### Обновление кода
```bash
cd /var/www/vox-shop
git pull origin main
cd backend
npm install
pm2 restart vox-backend
```

### Просмотр базы данных
```bash
sqlite3 /var/www/vox-shop/backend/data/vox.db
.tables
SELECT * FROM admins;
SELECT * FROM products;
.quit
```

### Сброс админа
```bash
cd /var/www/vox-shop/backend
rm data/vox.db
pm2 restart vox-backend
# Создастся новый админ из .env
```

---

## Решение проблем

### 502 Bad Gateway
```bash
pm2 status              # Проверить запущен ли Node.js
pm2 logs vox-backend    # Посмотреть ошибки
pm2 restart vox-backend # Перезапустить
```

### CORS ошибки
Проверьте что `FRONTEND_URL` в `.env` точно `https://voxbrand.ru`

### Нет доступа к файлам
```bash
chmod -R 755 /var/www/vox-shop/backend/uploads/
chown -R www-data:www-data /var/www/vox-shop/backend/uploads/
```

### Не создаётся админ
```bash
# Проверьте .env
cat /var/www/vox-shop/backend/.env

# Пересоздайте базу
rm /var/www/vox-shop/backend/data/vox.db
pm2 restart vox-backend
pm2 logs vox-backend  # Должно показать "Создан админ: voxshop"
```

---

## Структура на сервере

```
/var/www/vox-shop/
├── backend/
│   ├── data/vox.db         # SQLite база
│   ├── uploads/            # Изображения товаров
│   ├── src/                # Код сервера
│   ├── .env                # Переменные окружения
│   └── ecosystem.config.js # PM2 конфиг
└── ... (фронтенд если на том же сервере)
```

---

🚀 **Готово!** После выполнения всех шагов ваш магазин будет работать на:
- **Сайт**: https://voxbrand.ru
- **API**: https://api.voxbrand.ru
- **Админка**: https://voxbrand.ru/admin/login
