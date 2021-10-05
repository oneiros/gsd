const db = require("./db");

class Task {
  static all(callback) {
    db.tasks( (rows) => {
      const tasks = rows.map(r => new Task(r));
      callback(tasks);
    });
  }

  static find(id, callback) {
    db.findTask(id, (row) => {
      const foundTask = new Task(row);
      callback(foundTask);
    });
  }

  constructor(params) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.deadline = new Date(params.deadline);
    this.done = params.done;
  }

  late() {
    return (!this.done && (new Date(this.deadline) < new Date()));
  }

  save() {
    if (this.title && this.title != "" && this.deadline) {
      db.createTask(this.title, this.description, this.deadline, this.done, (id) => {
        this.id = id;
      });
      return true;
    }
    return false;
  }

  markDone() {
    db.taskDone(this.id);
    this.done = true;
  }

  destroy() {
    db.deleteTask(this.id);
  }
}

module.exports = Task
