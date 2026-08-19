import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('unit_id').unsigned().references('id').inTable('units').onDelete('CASCADE')
      table
        .enu('role', ['tenant', 'owner', 'resident'], {
          useNative: true,
          enumName: 'enrollment_roles',
        })
        .defaultTo('resident')
        .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
