import { ParkingRequestSchema } from '#database/schema'
import User from '#models/user'
import Unit from '#models/unit'
import Vehicle from '#models/vehicle'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ParkingRequest extends ParkingRequestSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Unit)
  declare unit: BelongsTo<typeof Unit>

  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>
}
