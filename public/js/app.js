/**
 * Client-side приложение для работы с Weekly Tasks API
 */

const API_URL = 'http://localhost:3000/api/tasks';

/**
 * Загрузить все задачи с фильтрацией
 */
async function loadTasks() {
    try {
        const day = document.getElementById('filter-day').value;
        const priority = document.getElementById('filter-priority').value;

        let url = API_URL;
        const params = new URLSearchParams();

        if (day) params.append('day', day);
        if (priority) params.append('priority', priority);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const data = await response.json();

        displayTasks(data.tasks || data);
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        showError('Ошибка при загрузке задач');
    }
}

/**
 * Отобразить задачи в HTML
 */
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks-list');

    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state"><h3>📭 Нет задач</h3><p>Создайте новую задачу, чтобы начать</p></div>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-info">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    <span class="tag day">📅 ${getDayName(task.day)}</span>
                    <span class="tag priority-${task.priority}">⭐ ${getPriorityName(task.priority)}</span>
                    ${task.completed ? '<span class="tag status">✓ Завершено</span>' : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-small btn-${task.completed ? 'uncomplete' : 'complete'}" 
                    onclick="toggleTask(${task.id}, ${!task.completed})">
                    ${task.completed ? '↩ Отменить' : '✓ Готово'}
                </button>
                <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">
                    🗑 Удалить
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Создать новую задачу
 */
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const day = document.getElementById('day').value;
    const priority = document.getElementById('priority').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                day,
                priority,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка при создании задачи');
        }

        // Очистить форму
        document.getElementById('task-form').reset();

        // Перезагрузить задачи
        loadTasks();

        showSuccess('Задача создана успешно! ✓');
    } catch (error) {
        console.error('Ошибка:', error);
        showError('Не удалось создать задачу');
    }
});

/**
 * Переключить статус задачи (завершено/не завершено)
 */
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) {
            throw new Error('Ошибка при обновлении задачи');
        }

        loadTasks();
        showSuccess(completed ? 'Задача отмечена как завершена! ✓' : 'Задача отмечена как невыполненная');
    } catch (error) {
        console.error('Ошибка:', error);
        showError('Не удалось обновить задачу');
    }
}

/**
 * Удалить задачу
 */
async function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Ошибка при удалении задачи');
        }

        loadTasks();
        showSuccess('Задача удалена ✓');
    } catch (error) {
        console.error('Ошибка:', error);
        showError('Не удалось удалить задачу');
    }
}

/**
 * Показать сообщение об ошибке
 */
function showError(message) {
    const tasksList = document.getElementById('tasks-list');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = '❌ ' + message;
    tasksList.parentNode.insertBefore(errorDiv, tasksList);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Показать сообщение об успехе
 */
function showSuccess(message) {
    const tasksList = document.getElementById('tasks-list');
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    tasksList.parentNode.insertBefore(successDiv, tasksList);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Экранировать HTML спецсимволы
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Получить русское имя дня недели
 */
function getDayName(day) {
    const days = {
        'пн': 'Понедельник',
        'вт': 'Вторник',
        'ср': 'Среда',
        'чт': 'Четверг',
        'пт': 'Пятница',
        'сб': 'Суббота',
        'вс': 'Воскресенье'
    };
    return days[day] || day;
}

/**
 * Получить русское имя приоритета
 */
function getPriorityName(priority) {
    const priorities = {
        'low': 'Низкий',
        'medium': 'Средний',
        'high': 'Высокий'
    };
    return priorities[priority] || priority;
}

/**
 * Инициализация при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    // Добавить слушатель для фильтра по дню
    document.getElementById('filter-day').addEventListener('change', loadTasks);

    // Добавить слушатель для фильтра по приоритету
    document.getElementById('filter-priority').addEventListener('change', loadTasks);
});