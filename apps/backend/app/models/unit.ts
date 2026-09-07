import { UnitSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Enrollment from '#models/enrollment'
import Authorization from '#models/authorization'

export default class Unit extends UnitSchema {
  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>

  @hasMany(() => Authorization)
  declare authorizations: HasMany<typeof Authorization>
}
