class Incident < ActiveRecord::Base
  validates :name, presence: true

  def self.send_notif_email(id)
    incident = Incident.find(id)
    Notification.notif_email(incident)
  end
end
