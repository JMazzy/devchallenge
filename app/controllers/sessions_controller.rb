class SessionsController < ApplicationController

  skip_before_action :require_login

  def new
  end


  def create
    @user = User.find_by_email(params[:email])

    # make sure the user's credentials authenticate before signing in
    if @user && @user.authenticate(params[:password])
      if params[:remember_me]
        permanent_sign_in(@user)
      else
        sign_in(@user)
      end
      flash[:success] = "You've successfully signed in"
      redirect_to root_url
    else
      flash.now[:danger] = "We couldn't sign you in"
      render :new
    end
  end


  def destroy
    sign_out
    flash[:success] = "You've successfully logged out."
    redirect_to :root
  end
end
