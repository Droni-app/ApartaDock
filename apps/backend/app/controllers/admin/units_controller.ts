import type { HttpContext } from '@adonisjs/core/http'
import Unit from '#models/unit'

export default class UnitsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))

    const units = await Unit.query().orderBy('updated_at', 'desc').paginate(page, limit)
    return units
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const unit = await Unit.findOrFail(params.id)
    return unit
  }
}