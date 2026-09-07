import type { HttpContext } from '@adonisjs/core/http'
import Unit from '#models/unit'

export default class UnitsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const q = request.input('q', '')
    const units = Unit.query().where('name', 'like', `${q}%`).paginate(1, 10)
    return units
  }

  async show({ params }: HttpContext) {
    const unit = Unit.query().where('id', params.id).preload('authorizations').firstOrFail()
    return unit
  }
}
