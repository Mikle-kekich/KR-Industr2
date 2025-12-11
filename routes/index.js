const express = require('express');
const router = express.Router();

/**
 * GET /
 * Главная страница приложения
 */
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Tasks API</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 1200px; 
          margin: 50px auto; 
          padding: 20px;
          background: #f5f5f5;
        }
        h1 { color: #667eea; }
        .endpoint { 
          background: white; 
          padding: 15px; 
          margin: 10px 0; 
          border-left: 4px solid #667eea;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        code { 
          background: #f0f0f0; 
          padding: 2px 6px; 
          border-radius: 3px;
        }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>📋 Weekly Tasks API</h1>
      <p>Express.js приложение для управления задачами на неделю</p>
      
      <h2>Основные API эндпоинты:</h2>
      
      <div class="endpoint">
        <strong>GET /api/tasks</strong><br>
        Получить все задачи
      </div>
      
      <div class="endpoint">
        <strong>GET /api/tasks/:id</strong><br>
        Получить задачу по ID
      </div>
      
      <div class="endpoint">
        <strong>POST /api/tasks</strong><br>
        Создать новую задачу
      </div>
      
      <div class="endpoint">
        <strong>PUT /api/tasks/:id</strong><br>
        Обновить задачу
      </div>
      
      <div class="endpoint">
        <strong>DELETE /api/tasks/:id</strong><br>
        Удалить задачу
      </div>
      
      <h2>Query параметры:</h2>
      <ul>
        <li><code>day</code> - день недели (пн, вт, ср, чт, пт, сб, вс)</li>
        <li><code>priority</code> - приоритет (low, medium, high)</li>
      </ul>
      
      <p><a href="/api/tasks">Проверить API →</a></p>
    </body>
    </html>
  `);
});

/**
 * GET /api
 * Информация об API
 */
router.get('/api', (req, res) => {
  res.json({
    name: 'Weekly Tasks API',
    version: '1.0.0',
    description: 'REST API для управления задачами на неделю',
    endpoints: {
      tasks: '/api/tasks',
      docs: '/'
    }
  });
});

module.exports = router;