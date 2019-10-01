module GSD
  class DB
    DB_FILE = "gsd.db"

    def self.instance
      @instance ||= new
    end

    def initialize
      new_db = !File.exists?(DB_FILE)
      @db = SQLite3::Database.new DB_FILE
      setup! if new_db
    end

    def tasks
      result = []
      @db.execute "SELECT id, title, description, deadline, done FROM tasks" do |row|
        result << row
      end
      result
    end

    def create_task(title, description, deadline, done)
      done = done ? 1 : 0
      @db.execute "INSERT INTO tasks(title, description, deadline, done) VALUES (?, ?, ?, ?)", title, description, deadline, done
      @db.last_insert_row_id
    end

    def find_task(id)
      @db.execute("SELECT id, title, description, deadline, done FROM tasks WHERE id = ?", id).first
    end

    def task_done(id)
      @db.execute("UPDATE tasks SET done = 1 WHERE id = ?", id)
    end

    def delete_task(id)
      @db.execute("DELETE FROM tasks WHERE id = ?", id)
    end

    private

    def setup!
      @db.execute <<~SQL
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          deadline DATE,
          done BOOLEAN
        );
      SQL

      now = Time.now

      5.times do
        title = "#{Faker::Verb.base} #{[Faker::House.furniture, Faker::House.room, Faker::Appliance.equipment].sample}"
        description = Faker::Lorem.paragraph
        deadline = Time.at(now.to_i + (rand(-5..5) * 3600 * 24)).to_date.to_s
        done = (rand(1..5) == 1)
        create_task(title, description, deadline, done)
      end
    end
  end
end
