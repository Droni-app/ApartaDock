import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'parking_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('unit_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('units')
        .onDelete('CASCADE')
      table
        .integer('vehicle_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')
      table.enu('period', ['h1', 'h2']).notNullable()
      table.integer('period_year').notNullable()
      table.string('insurance_policy').nullable()
      table.string('technical_review').nullable()
      table.string('authorization').nullable()
      table
        .enu('status', ['pending', 'approved', 'rejected', 'cancelled'])
        .notNullable()
        .defaultTo('pending')
      table.text('notes').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
