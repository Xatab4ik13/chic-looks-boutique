const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Создаём папку для загрузок если нет
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Допустимые форматы: JPEG, PNG, WebP, GIF'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// POST /api/upload - Загрузить изображение
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

// POST /api/upload/base64 - Загрузить изображение в base64
router.post('/base64', authenticateToken, (req, res) => {
  try {
    const { image, filename: originalName } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Изображение не предоставлено' });
    }

    // Извлекаем данные из base64
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Неверный формат изображения' });
    }

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const filename = `${uuidv4()}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    res.json({
      url: imageUrl,
      filename,
      originalName: originalName || filename,
      size: buffer.length,
    });
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

// DELETE /api/upload/:filename - Удалить изображение
router.delete('/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Защита от path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Недопустимое имя файла' });
    }

    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    fs.unlinkSync(filePath);
    
    res.json({ message: 'Файл удалён', filename });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Ошибка удаления файла' });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (макс 10MB)' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
