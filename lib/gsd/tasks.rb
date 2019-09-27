module GSD
  class  Tasks < Base
    get "/" do
      @tasks = Task.all

      erb :index
    end

    post "/tasks" do
      task = build_task

      if request.xhr?
        if task.save
          erb :task, {layout: false}, task: task
        else
          422
        end
      else
        if task.save
          session[:notification] = "Task was added successfully!"
        else
          session[:error] = "Missing data. Task could not be added."
        end
        redirect "/"
      end
    end

    patch "/tasks/:id/done" do |id|
      task = Task.find(id)
      task.done!


      if request.xhr?
        200
      else
        session[:notification] = "Task is now done! Congrats!"
        redirect "/"
      end
    end

    delete "/tasks/:id" do |id|
      task = Task.find(id)

      if request.xhr?
        if task.done?
          task.delete
          200
        else
          422
        end
      else
        if task.done?
          task.delete
          session[:notification] = "Task was deleted"
        else
          session[:error] = "Unfinished tasks cannot be deleted"
        end

        redirect "/"
      end
    end

    private

    def build_task
      Task.new(
        title: params[:task][:title],
        description: params[:task][:description],
        deadline: params[:task][:deadline]
      )
    end
  end
end
