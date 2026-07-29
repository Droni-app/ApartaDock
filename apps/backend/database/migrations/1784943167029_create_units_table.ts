import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'units'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable().unique()
      table.integer('tower').notNullable()
      table.integer('apto').notNullable()
      table.integer('floor').notNullable()
      table.integer('typology').notNullable().defaultTo(1)
      table.decimal('build_area', 10, 2).nullable()
      table.decimal('private_area', 10, 2).nullable()
      table.decimal('coefficient', 6, 4).nullable()
      table
        .enu('status', ['occupied', 'vacant', 'rented', 'maintenance'])
        .notNullable()
        .defaultTo('vacant')
      table.integer('debt').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}