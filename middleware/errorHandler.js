/**
 * Глобальный middleware для обработки ошибок
 * Централизованная обработка всех ошибок приложения
 */

module.exports = (err, req, res, next) => {
  // Логирование ошибки в консоль
  console.error('\n❌ Ошибка:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('');
  
  // Определение кода статуса
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';
  
  // Отправка ошибки клиенту
  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
};