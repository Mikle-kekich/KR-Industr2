const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/taskController');
const { validateTask } = require('../../middleware/validator');

/**
 * GET /api/tasks
 * Получить все задачи с фильтрацией по day и priority
 * Query параметры:
 *   - day (пн, вт, ср, чт, пт, сб, вс)
 *   - priority (low, medium, high)
 */
router.get('/', taskController.getAllTasks);

/**
 * GET /api/tasks/:id
 * Получить одну задачу по ID
 */
router.get('/:id', taskController.getTaskById);

/**
 * GET /api/tasks/day/:day
 * Получить все задачи на конкретный день
 */
router.get('/day/:day', taskController.getTasksByDay);

/**
 * POST /api/tasks
 * Создать новую задачу
 * Требуемые поля: title, day, priority
 */
router.post('/', validateTask, taskController.createTask);

/**
 * PUT /api/tasks/:id
 * Обновить задачу по ID
 */
router.put('/:id', validateTask, taskController.updateTask);

/**
 * DELETE /api/tasks/:id
 * Удалить задачу по ID
 */
router.delete('/:id', taskController.deleteTask);

/**
 * DELETE /api/tasks
 * Удалить все задачи (требуется confirm=true)
 */
router.delete('/', taskController.deleteAllTasks);

module.exports = router;