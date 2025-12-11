/**
 * Модель Задачи (Task)
 * Представляет структуру одной задачи в системе
 */
class Task {
  constructor(id, title, description = '', day = 'пн', priority = 'medium', completed = false) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.day = day;
    this.priority = priority;
    this.completed = completed;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  complete() {
    this.completed = true;
    this.updatedAt = new Date();
  }
  
  uncomplete() {
    this.completed = false;
    this.updatedAt = new Date();
  }
  
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      day: this.day,
      priority: this.priority,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Task;
