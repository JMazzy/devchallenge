class IncidentsController < ApplicationController

  def index
    @incidents = Incident.all
    respond_to do |format|
      format.json { render json: @incidents.to_json }
    end
  end


  def show
    @incident = Incident.find( params[:id] )
  end


  def create
    @incident = Incident.new( incident_params )
    @incident.shape = "POINT(#{@incident.lat} #{@incident.lon})"
    if @incident.save
      flash[:success] = "Incident created."
    else
      flash[:error] = "Incident could not be created."
    end

    respond_to do |format|
      format.json { render json: @incident.to_json }
    end
  end


  def update
    @incident = Incident.find(params[:id])
    if @incident.update( incident_params )
      flash[:success] = "Incident updated."
    else
      flash[:error] = "Incident could not be updated."
    end

    respond_to do |format|
      format.html { redirect_to :back }
      format.json { render json: @incident.to_json }
    end
  end


  def destroy
    @incident = Incident.find(params[:id])
    if @incident.destroy
      flash[:success] = "Incident deleted."
    else
      flash[:error] = "Incident could not be deleted."
    end

    respond_to do |format|
      format.html { redirect_to :back }
      format.json { render json: @incident.to_json }
    end
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
