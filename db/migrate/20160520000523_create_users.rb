class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email, unique: true, null: false
      t.string :password_digest
      t.string :auth_token

      t.index :auth_token, unique: true

      t.timestamps null: false
    end
  end
end
