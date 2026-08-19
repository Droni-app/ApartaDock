import { AttachmentSchema } from '#database/schema'
import { belongsTo, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import env from '#start/env'

export default class Attachment extends AttachmentSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @computed()
  get url(): string {
    const bucket = env.get('SPACES_BUCKET')
    const region = env.get('SPACES_REGION')
    return `https://${bucket}.${region}.digitaloceanspaces.com/${this.path}`
  }
}
