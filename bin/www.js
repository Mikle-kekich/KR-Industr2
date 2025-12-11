#!/usr/bin/env node

/**
 * Точка входа приложения
 * Запускает Express сервер на порту 3000
 */

const app = require('../app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Создание и запуск сервера
const server = app.listen(PORT, HOST, () => {
  console.log(`\n✅ Сервер запущен успешно!`);
  console.log(`🌐 http://${HOST}:${PORT}`);
  console.log(`📡 API: http://${HOST}:${PORT}/api/tasks\n`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Порт ${PORT} требует прав администратора`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Порт ${PORT} уже занят`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 Получен сигнал SIGTERM, завершаю сервер...');
  server.close(() => {
    console.log('✋ Сервер остановлен');
    process.exit(0);
  });
});