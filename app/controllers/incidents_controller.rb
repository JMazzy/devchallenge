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

    respond_to do |format|
      if @incident.save
        flash[:success] = "Incident created."
        format.json { render json: @incident.to_json }
        Notification.notif_email(@incident).deliver_later
      else
        flash[:error] = "Incident could not be created."
        format.json {render json: @incident.errors, status: :unprocessable_entity}
      end
    end
  end


  def update
    @incident = Incident.find(params[:id])

    respond_to do |format|
      if @incident.update( incident_params )
        flash[:success] = "Incident updated."
        format.json { render json: @incident.to_json }
      else
        flash[:error] = "Incident could not be updated."
        format.json {render json: @incident.errors, status: :unprocessable_entity}
      end
    end
  end


  def destroy
    @incident = Incident.find(params[:id])

    respond_to do |format|
      if @incident.destroy
        flash[:success] = "Incident deleted."
        format.json { render json: @incident.to_json }
      else
        flash[:error] = "Incident could not be deleted."
        format.json {render json: @incident.errors, status: :unprocessable_entity}
      end
    end
  end

  private

  def incident_params
    params.require(:incident).permit(
      :id,
      :geography,
      :lat,
      :lon,
      :name,
      :acres,
      :notes )
  end
end
