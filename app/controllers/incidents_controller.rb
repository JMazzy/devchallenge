class IncidentsController < ApplicationController

  def index
    @incidents = Incident.all
    respond_to do |format|
      format.json { render json: @incidents.to_json }
    end
  end

  def create
    @incident = Incident.new( incident_params )
    @incident.shape = "POINT(#{@incident.lat} #{@incident.lon})"
    if @incident.save
      flash[:success] = "Incident created."
    else
      flash[:error] = "Incident could not be created."
    end
    redirect_to :back
  end


  def update
    @incident = Incident.find(params[:id])
    if @incident.update( incident_params )
      flash[:success] = "Incident updated."
    else
      flash[:error] = "Incident could not be updated."
    end
    redirect_to :back
  end


  def destroy
    @incident = Incident.find(params[:id])
    if @incident.destroy
      flash[:success] = "Incident deleted."
    else
      flash[:error] = "Incident could not be deleted."
    end
    redirect_to :back
  end

  private

  def incident_params
    params.require(:incident).permit( :geography,
                                      :lat,
                                      :lon,
                                      :name,
                                      :acres,
                                      :notes )
  end
end
