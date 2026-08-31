import { VisitorSchema } from '#database/schema'
import Unit from '#models/unit'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Visitor extends VisitorSchema {
  @belongsTo(() => Unit)
  declare unit: BelongsTo<typeof Unit>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
