/**
 * Собственный middleware для логирования HTTP запросов
 * Выводит информацию о методе, URL, статусе и времени выполнения
 */

module.exports = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.connection.remoteAddress;
  
  // Логирование при завершении ответа
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Цвет в зависимости от статуса
    const statusColor = status >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(
      `${new Date().toISOString()} | ` +
      `${statusColor}${status}${resetColor} | ` +
      `${req.method.padEnd(6)} | ` +
      `${duration}ms | ` +
      `${req.path} | ` +
      `${ip}`
    );
  });
  
  next();
};