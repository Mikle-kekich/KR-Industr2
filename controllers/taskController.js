const Task = require('../models/Task');

/**
 * Массив для хранения задач (в реальном приложении используется БД)
 */
let tasks = [
  new Task(1, 'Подготовить отчёт', 'Квартальный отчёт', 'пн', 'high', false),
  new Task(2, 'Проверить коды', 'Code review', 'вт', 'medium', true),
  new Task(3, 'Встреча с командой', 'Планирование спринта', 'ср', 'medium', false),
  new Task(4, 'Написать документацию', 'API docs', 'чт', 'low', false),
  new Task(5, 'Deploy в production', 'Выпуск версии', 'пт', 'high', true)
];

let nextId = 6;

/**
 * GET /api/tasks
 * Получить все задачи с фильтрацией
 */
exports.getAllTasks = (req, res) => {
  const { day, priority } = req.query;
  
  let filtered = [...tasks];
  
  // Фильтрация по дню
  if (day) {
    filtered = filtered.filter(t => t.day === day);
  }
  
  // Фильтрация по приоритету
  if (priority) {
    filtered = filtered.filter(t => t.priority === priority);
  }
  
  res.json({
    count: filtered.length,
    tasks: filtered
  });
};

/**
 * GET /api/tasks/:id
 * Получить одну задачу по ID
 */
exports.getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      error: 'Задача не найдена',
      id: id
    });
  }
  
  res.json(task);
};

/**
 * GET /api/tasks/day/:day
 * Получить все задачи на конкретный день
 */
exports.getTasksByDay = (req, res) => {
  const day = req.params.day;
  const validDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  
  if (!validDays.includes(day)) {
    return res.status(400).json({
      error: 'Неверный день недели',
      validDays: validDays
    });
  }
  
  const filtered = tasks.filter(t => t.day === day);
  
  res.json({
    day: day,
    count: filtered.length,
    tasks: filtered
  });
};

/**
 * POST /api/tasks
 * Создать новую задачу
 */
exports.createTask = (req, res) => {
  const { title, description, day, priority, completed } = req.body;
  
  // Создание новой задачи
  const task = new Task(
    nextId++,
    title,
    description || '',
    day || 'пн',
    priority || 'medium',
    completed || false
  );
  
  // Добавление в массив
  tasks.push(task);
  
  // Ответ со статусом 201 Created
  res.status(201).json({
    message: 'Задача создана успешно',
    task: task
  });
};

/**
 * PUT /api/tasks/:id
 * Обновить задачу по ID
 */
exports.updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      error: 'Задача не найдена',
      id: id
    });
  }
  
  // Обновление только переданных полей
  const { title, description, day, priority, completed } = req.body;
  
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (day !== undefined) task.day = day;
  if (priority !== undefined) task.priority = priority;
  if (completed !== undefined) task.completed = completed;
  
  task.updatedAt = new Date();
  
  res.json({
    message: 'Задача обновлена успешно',
    task: task
  });
};

/**
 * DELETE /api/tasks/:id
 * Удалить задачу по ID
 */
exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      error: 'Задача не найдена',
      id: id
    });
  }
  
  const deleted = tasks.splice(index, 1)[0];
  
  res.json({
    message: 'Задача удалена успешно',
    task: deleted
  });
};

/**
 * DELETE /api/tasks
 * Удалить все задачи (требуется confirm=true)
 */
exports.deleteAllTasks = (req, res) => {
  const { confirm } = req.query;
  
  if (confirm !== 'true') {
    return res.status(400).json({
      error: 'Для удаления всех задач используйте query параметр ?confirm=true',
      example: '/api/tasks?confirm=true'
    });
  }
  
  const count = tasks.length;
  tasks = [];
  nextId = 1;
  
  res.json({
    message: 'Все задачи удалены',
    deletedCount: count
  });
};

/**
 * Получить статистику задач
 */
exports.getStats = (req, res) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    byPriority: {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    },
    byDay: {
      пн: tasks.filter(t => t.day === 'пн').length,
      вт: tasks.filter(t => t.day === 'вт').length,
      ср: tasks.filter(t => t.day === 'ср').length,
      чт: tasks.filter(t => t.day === 'чт').length,
      пт: tasks.filter(t => t.day === 'пт').length,
      сб: tasks.filter(t => t.day === 'сб').length,
      вс: tasks.filter(t => t.day === 'вс').length
    }
  };
  
  res.json(stats);
};