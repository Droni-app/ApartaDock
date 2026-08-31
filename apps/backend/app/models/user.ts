import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { CherryPick, ModelObject } from '@adonisjs/lucid/types/model'
import Enrollment from '#models/enrollment'

function obfuscateEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email

  const maskedLocal = local.charAt(0) + 'x'.repeat(Math.max(local.length - 1, 1))

  const domainParts = domain.split('.')
  const label = domainParts.shift() ?? ''
  const maskedLabel = label.slice(0, 2) + 'x'.repeat(Math.max(label.length - 2, 1))

  return `${maskedLocal}@${[maskedLabel, ...domainParts].join('.')}`
}

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>

  /**
   * Non-persisted flag. When true, serialize() returns the real email
   * instead of the obfuscated one. Set via User.reveal() for contexts
   * that are allowed to see the full address (the user's own profile,
   * admin user management).
   */
  revealEmail = false

  static reveal<T extends User | User[]>(target: T): T {
    for (const user of Array.isArray(target) ? target : [target]) {
      user.revealEmail = true
    }
    return target
  }

  serialize(cherryPick?: CherryPick): ModelObject {
    const json = super.serialize(cherryPick)
    if (typeof json.email === 'string' && !this.revealEmail) {
      json.email = obfuscateEmail(json.email)
    }
    return json
  }
}
