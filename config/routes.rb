Rails.application.routes.draw do
  root to: "sessions#new"

  resources :users
  resources :sessions, only: [:new, :create, :destroy]
end
