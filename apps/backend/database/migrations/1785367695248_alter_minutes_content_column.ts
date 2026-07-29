import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'minutes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('content', 'longtext').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('content').nullable().alter()
    })
  }
}
