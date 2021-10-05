const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const faker = require('faker');

const DB_FILE = path.join(__dirname, '../gsd.db');

class DB {
  constructor() {
    this.db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (error) => {
      if (error && error.code == "SQLITE_CANTOPEN") {
        this.db = new sqlite3.Database(DB_FILE);
        this.setup();
      }
    });
  }

  tasks(callback) {
    this.db.all("SELECT id, title, description, deadline, done FROM tasks", (error, rows) => {
      if (!error) {
        callback(rows);
      }
    });
  }

  createTask(title, description, deadline, done, callback) {
    this.db.serialize(() => {
      this.db.run("INSERT INTO tasks(title, description, deadline, done) VALUES (?, ?, ?, ?)", title, description, deadline, done, function(error) {
        if (!error && callback) {
          callback(this.lastID);        
        }
      });
    });
  }

  findTask(id, callback) {
    this.db.get("SELECT id, title, description, deadline, done FROM tasks WHERE id = ?", id, (error, row) => {
      if (!error) {
        callback(row);
      }
    });
  }

  taskDone(id) {
    this.db.run("UPDATE tasks SET done = 1 WHERE id = ?", id);
  }

  deleteTask(id) {
    this.db.run("DELETE FROM tasks WHERE id = ?", id)
  }

  setup() {
    this.db.serialize( () => {
      this.db.run(`
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          deadline DATE,
          done BOOLEAN
        );
      `);
      for (let i = 0; i < 5; i++) {
        const title = faker.fake("{{hacker.verb}} {{random.word}}");
        const description = faker.lorem.paragraph();
        const deadline = faker.date.soon();
        const done = faker.datatype.boolean();
        this.createTask(title, description, deadline, done);
      }
    });
  }
}

module.exports = new DB();
