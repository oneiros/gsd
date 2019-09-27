module GSD
  class Base < Sinatra::Base
    set :root, File.expand_path("../../../", __FILE__)
    set :method_override, true

    enable :sessions

    before do
      if session[:notification]
        @notification = session[:notification]
        session[:notification] = nil
      end
      if session[:error]
        @error = session[:error]
        session[:error] = nil
      end
    end
  end
end
