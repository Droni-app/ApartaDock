import { EnrollmentSchema } from '#database/schema'
import User from '#models/user'
import Unit from '#models/unit'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Enrollment extends EnrollmentSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Unit)
  declare unit: BelongsTo<typeof Unit>
}
