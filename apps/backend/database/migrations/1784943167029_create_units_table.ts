import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'units'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('tower', 20).notNullable()
      table.string('apto', 20).notNullable()
      table.string('block', 20).nullable()
      table.integer('floor').nullable()
      table.decimal('area', 10, 2).nullable()
      table.decimal('coefficient', 6, 4).nullable()
      table
        .enu('status', ['occupied', 'vacant', 'rented', 'maintenance'])
        .notNullable()
        .defaultTo('vacant')
      table.text('notes').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}