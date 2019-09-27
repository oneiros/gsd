require "date"

require "sinatra"
require "sqlite3"
require "rack/delay"
require "faker"

require_relative "gsd/db"
require_relative "gsd/task"

require_relative "gsd/base"
require_relative "gsd/tasks"

module GSD
  class App < Sinatra::Base

    if ENV["DELAY"]
      use Rack::Delay, {
        :min => 0,    # ms
        :max => 5000, # ms
        :if => lambda { |request| request.post? || request.xhr?  }
      }
    end

    use Tasks
  end
end
