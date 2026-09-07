import type { HttpContext } from '@adonisjs/core/http'
import Visitor from '#models/visitor'
import Enrollment from '#models/enrollment'
import Authorization from '#models/authorization'
import { DateTime } from 'luxon'

export default class VisitorsController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const units = await Enrollment.query()
      .where('userId', auth.user!.id)
      .preload('unit')
      .select('unitId')

    const unitIds = units.map((enrollment) => String(enrollment.unitId))

    return await Visitor.query()
      .whereNull('authorizationId')
      .whereIn('unitId', unitIds)
      .preload('unit')
      .orderBy('checkinDate', 'desc')
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params }: HttpContext) {
    const visitor = await Visitor.query().where('id', params.id).firstOrFail()
    // validate ownership
    await Enrollment.query()
      .where('userId', auth.user!.id)
      .andWhere('unitId', visitor.unitId)
      .firstOrFail()

    // create new authorization
    const authorization = await Authorization.create({
      userId: auth.user!.id,
      unitId: visitor.unitId,
      plate: visitor.plate,
      fullName: visitor.fullName,
    })

    visitor.authorizationId = authorization.id
    await visitor.save()

    return visitor
  }

  async destroy({ auth, params }: HttpContext) {
    const visitor = await Visitor.query().where('id', params.id).firstOrFail()
    // validate ownership
    await Enrollment.query()
      .where('userId', auth.user!.id)
      .andWhere('unitId', visitor.unitId)
      .firstOrFail()

    await visitor.delete()

    return { message: 'Visitor request deleted successfully' }
  }
}
