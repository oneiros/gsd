module GSD
  class Task
    attr_accessor :id, :title, :description, :deadline, :done

    def self.all
      DB.instance.tasks.map do |attributes|
        new(
          id: attributes[0],
          title: attributes[1],
          description: attributes[2],
          deadline: attributes[3],
          done: attributes[4]
        )
      end
    end

    def self.find(id)
      attributes = DB.instance.find_task(id)
      new(
        id: attributes[0],
        title: attributes[1],
        description: attributes[2],
        deadline: attributes[3],
        done: attributes[4]
      )
    end

    def initialize(id: nil, title: nil, description: nil, deadline: nil, done: false)
      @id = id
      @title = title
      @description = description
      @deadline = deadline
      @done = done
    end

    def done?
      done == 1
    end

    def late?
      !done? && (Date.parse(deadline) < Date.today)
    end

    def save
      if !title.nil? && title != "" && !deadline.nil?
        self.id = DB.instance.create_task(
          title, description, deadline, done
        )
        true
      else
        false
      end
    end

    def done!
      DB.instance.task_done(id)
      self.done = true
    end

    def delete
      DB.instance.delete_task(id)
    end
  end
end
