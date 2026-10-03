import { VisitorSchema } from '#database/schema'
import Unit from '#models/unit'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Authorization from '#models/authorization'

export default class Visitor extends VisitorSchema {
  @belongsTo(() => Unit)
  declare unit: BelongsTo<typeof Unit>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Authorization)
  declare authorization: BelongsTo<typeof Authorization>
}
