import type { HttpContext } from '@adonisjs/core/http'
import Log from '#models/log'

export default class LogsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const userEmail = request.input('user_email', '')
    const method = request.input('method', '')
    const endpoint = request.input('endpoint', '')

    const query = Log.query().preload('user').orderBy('created_at', 'desc')

    if (userEmail) {
      query.whereHas('user', (userQuery) => userQuery.whereILike('email', `%${userEmail}%`))
    }

    if (method) {
      query.where('method', method)
    }

    if (endpoint) {
      query.whereILike('endpoint', `%${endpoint}%`)
    }

    const logs = await query.paginate(page, limit)
    return logs
  }
}
