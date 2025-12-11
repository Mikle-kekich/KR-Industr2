/**
 * Middleware для валидации данных задачи
 * Проверяет корректность входных данных перед обработкой
 */

module.exports = {
  /**
   * Валидация данных при создании/обновлении задачи
   */
  validateTask: (req, res, next) => {
    const { title, day, priority } = req.body;
    const errors = [];
    
    // Проверка title
    if (title !== undefined) {
      if (typeof title !== 'string') {
        errors.push('title должен быть строкой');
      } else if (title.trim() === '') {
        errors.push('title не может быть пустым');
      } else if (title.length > 200) {
        errors.push('title не может быть длиннее 200 символов');
      }
    }
    
    // Проверка day
    if (day !== undefined) {
      const validDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
      if (!validDays.includes(day)) {
        errors.push(`day должен быть одним из: ${validDays.join(', ')}`);
      }
    }
    
    // Проверка priority
    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        errors.push(`priority должен быть одним из: ${validPriorities.join(', ')}`);
      }
    }
    
    // Если есть ошибки, отправляем их
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Ошибка валидации',
        details: errors
      });
    }
    
    next();
  },
  
  /**
   * Валидация ID параметра
   */
  validateId: (req, res, next) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        error: 'ID должен быть положительным числом'
      });
    }
    
    next();
  }
};