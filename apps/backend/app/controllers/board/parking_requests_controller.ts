import type { HttpContext } from '@adonisjs/core/http'
import ParkingRequest from '#models/parking_request'
import { updateParkingRequestValidator } from '#validators/board/parking_request_validator'

export default class ParkingRequestsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const unitName = request.input('unit_name', '')
    const vehicleType = request.input('vehicle_type', '')
    const userEmail = request.input('user_email', '')
    const vehiclePlate = request.input('vehicle_plate', '')
    const status = request.input('status', '')

    const query = ParkingRequest.query()
      .preload('user')
      .preload('unit')
      .preload('vehicle')
      .orderBy('updated_at', 'desc')

    if (unitName) {
      query.whereHas('unit', (unitQuery) => unitQuery.whereILike('name', `%${unitName}%`))
    }

    if (vehicleType) {
      query.whereHas('vehicle', (vehicleQuery) => vehicleQuery.where('vehicleType', vehicleType))
    }

    if (userEmail) {
      query.whereHas('user', (userQuery) => userQuery.whereILike('email', `%${userEmail}%`))
    }

    if (vehiclePlate) {
      query.whereHas('vehicle', (vehicleQuery) => vehicleQuery.whereILike('plate', `%${vehiclePlate}%`))
    }

    if (status) {
      query.where('status', status)
    }

    const parkingRequests = await query.paginate(page, limit)
    return parkingRequests
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const parkingRequest = await ParkingRequest.query()
      .preload('user')
      .preload('unit')
      .preload('vehicle')
      .where('id', params.id)
      .firstOrFail()
    return parkingRequest
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const parkingRequest = await ParkingRequest.findOrFail(params.id)
    const { notes, ...payload } = await request.validateUsing(updateParkingRequestValidator)

    parkingRequest.merge(payload)

    if (notes) {
      parkingRequest.notes = parkingRequest.notes ? `${parkingRequest.notes}\n${notes}` : notes
    }

    await parkingRequest.save()
    return parkingRequest
  }
}
