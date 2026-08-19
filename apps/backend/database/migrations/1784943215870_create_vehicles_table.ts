import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

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
      table.string('plate', 20).nullable()
      table.boolean('is_owner').defaultTo(true)
      table.string('owner_card').notNullable()
      table.string('owner_name').notNullable()
      table.string('owner_document').notNullable()
      table.string('driver_license').nullable()
      table.string('brand').nullable()
      table.string('model').nullable()
      table.string('color').nullable()
      table.integer('year').notNullable()
      table
        .enu('vehicle_type', ['car', 'motorcycle', 'bicycle', 'truck', 'other'])
        .notNullable()
        .defaultTo('car')

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
