class Incident < ActiveRecord::Base
  validates :name, presence: true
end
