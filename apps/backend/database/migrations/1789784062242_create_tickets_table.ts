import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

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
      table.string('name')
      table.json('owners').defaultTo(JSON.stringify([]))
      table.enu('priority', ['low', 'medium', 'high', 'critical']).nullable()
      table.text('content')
      table.string('attachment').nullable()
      table
        .enu('status', ['open', 'solved', 'pending', 'rejected', 'accepted', 'close'])
        .defaultTo('open')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
