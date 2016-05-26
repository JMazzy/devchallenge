class Notification < ApplicationMailer

  def notif_email(incident)
    @incident = incident
    mail from: 'j.masland@gmail.com', to: 'j.masland@gmail.com', subject: 'map notif'
  end
  handle_asynchronously :notif_email

end
