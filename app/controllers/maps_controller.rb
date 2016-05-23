class MapsController < ApplicationController

  def index
    @incident = Incident.new
  end

end
