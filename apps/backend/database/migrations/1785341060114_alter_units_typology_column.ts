import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'units'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('typology').notNullable().defaultTo(1).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('typology').notNullable().defaultTo(1).alter()
    })
  }
}
