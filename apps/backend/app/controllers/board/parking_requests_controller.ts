import type { HttpContext } from '@adonisjs/core/http'
import ParkingRequest from '#models/parking_request'
import { updateParkingRequestValidator } from '#validators/board/parking_request_validator'

interface StatusCountRow {
  status: string
  total: number | string
}

interface VehicleTypeCountRow {
  vehicleType: string | null
  total: number | string
}

export default class ParkingRequestsController {
  /**
   * Display a general Dashboard with statistics and recent parking requests
   */
  async dashboard({}: HttpContext) {
    const [byStatus, byVehicleType] = (await Promise.all([
      ParkingRequest.query().pojo().select('status').count('* as total').groupBy('status'),
      ParkingRequest.query()
        .pojo()
        .leftJoin('vehicles', 'vehicles.id', 'parking_requests.vehicle_id')
        .select('vehicles.vehicle_type as vehicleType')
        .where('parking_requests.status', 'approved')
        .count('* as total')
        .groupBy('vehicles.vehicle_type'),
    ])) as [StatusCountRow[], VehicleTypeCountRow[]]

    return {
      byStatus: byStatus.map((row) => ({
        status: row.status,
        total: Number(row.total),
      })),
      byVehicleTypeApproved: byVehicleType.map((row) => ({
        vehicleType: row.vehicleType ?? null,
        total: Number(row.total),
      })),
    }
  }
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
