class CreateIncidents < ActiveRecord::Migration
  def change
    create_table :incidents do |t|
      t.st_point :shape, geographic: true, srid: 4326, null: false
      t.float :lat
      t.float :lon
      t.string :name, null: false
      t.float :acres
      t.text :notes

      t.timestamps null: false
    end
  end
end
