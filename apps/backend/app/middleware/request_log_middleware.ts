import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Log from '#models/log'

const LOGGED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
const SENSITIVE_KEY_PATTERN = /password|token|secret/i

export default class RequestLogMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      return await next()
    } finally {
      await this.recordLog(ctx)
    }
  }

  private async recordLog({ request, auth, route }: HttpContext) {
    if (!LOGGED_METHODS.includes(request.method()) || !auth.user) {
      return
    }

    try {
      const payload: Record<string, unknown> = { ...request.body() }
      for (const key of Object.keys(payload)) {
        if (SENSITIVE_KEY_PATTERN.test(key)) {
          payload[key] = '[REDACTED]'
        }
      }

      await Log.create({
        userId: auth.user.id,
        endpoint: route?.pattern ?? request.url(),
        method: request.method(),
        payload: JSON.stringify(payload),
      })
    } catch {
      // A logging failure must never break the actual request/response cycle.
    }
  }
}
