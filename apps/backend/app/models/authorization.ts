import { AuthorizationSchema } from '#database/schema'
import Unit from '#models/unit'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Authorization extends AuthorizationSchema {
  @belongsTo(() => Unit)
  declare unit: BelongsTo<typeof Unit>
}
