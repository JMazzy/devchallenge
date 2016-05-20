class UsersController < ApplicationController

  skip_before_action :require_login, only: [:new, :create]

end
