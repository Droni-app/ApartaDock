import type { HttpContext } from '@adonisjs/core/http'
import Enrollment from '#models/enrollment'
import ParkingRequest from '#models/parking_request'

export default class EnrollmentsController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const enrollments = await Enrollment.query()
      .where('userId', user.id)
      .preload('unit')
      .orderBy('updated_at', 'desc')

    return enrollments
  }

  /**
   * Show individual record
   */
  async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()

    const enrollment = await Enrollment.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('unit')
      .firstOrFail()

    const parkingRequests = enrollment.unitId
      ? await ParkingRequest.query()
          .where('unitId', enrollment.unitId)
          .preload('vehicle')
          .orderBy('created_at', 'desc')
      : []

    return {
      ...enrollment.serialize(),
      parkingRequests,
    }
  }
}
