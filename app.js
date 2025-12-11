const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

// Импорт middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Импорт маршрутов
const apiRoutes = require('./routes/api/tasks');
const indexRoutes = require('./routes/index');

const app = express();

// ===== MIDDLEWARE =====

// CORS для кросс-доменных запросов
app.use(cors());

// Логирование HTTP запросов (morgan)
app.use(morgan('combined'));

// Парсеры для обработки тела запроса
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Встроенные парсеры Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Собственный middleware для логирования
app.use(logger);

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// ===== МАРШРУТЫ =====

// Главная страница
app.use('/', indexRoutes);

// API маршруты для задач
app.use('/api/tasks', apiRoutes);

// Обработка маршрутов, которые не найдены (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.path,
    method: req.method
  });
});

// ===== ОБРАБОТКА ОШИБОК =====

// Глобальный обработчик ошибок (должен быть последним)
app.use(errorHandler);

module.exports = app;