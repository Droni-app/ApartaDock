import type { HttpContext } from '@adonisjs/core/http'
import Unit from '#models/unit'

export default class UnitsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const search = request.input('q', '')

    const query = Unit.query().orderBy('updated_at', 'desc')

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    const units = await query.paginate(page, limit)
    return units
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const unit = await Unit.query()
      .preload('enrollments', (enrollmentsQuery) => {
        enrollmentsQuery.preload('user')
      })
      .where('id', params.id)
      .firstOrFail()
    return unit
  }
}