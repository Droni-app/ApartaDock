import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('unit_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('units')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('authorization_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('authorizations')
      table.string('full_name')
      table.string('document').nullable()
      table.string('plate', 20).nullable()
      table.enu('vehicle_type', ['car', 'motorcycle']).nullable()
      table.timestamp('checkin_date').nullable()
      table.timestamp('checkout_date').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
