import type { HttpContext } from '@adonisjs/core/http'
import Vehicle from '#models/vehicle'
import { createVehicleValidator, updateVehicleValidator } from '#validators/user/vehicle_validator'

function normalizePlate(plate: string | null | undefined): string | null {
  if (!plate) {
    return null
  }
  return plate.toUpperCase().replace(/\s+/g, '')
}

export default class VehiclesController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const vehicles = await Vehicle.query().where('userId', user.id).orderBy('created_at', 'desc')

    return vehicles
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createVehicleValidator)

    const vehicle = await Vehicle.create({
      ...payload,
      plate: normalizePlate(payload.plate),
      userId: user.id,
    })

    return vehicle
  }

  /**
   * Show individual record
   */
  async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()

    const vehicle = await Vehicle.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    return vehicle
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()

    const vehicle = await Vehicle.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await request.validateUsing(updateVehicleValidator)

    vehicle.merge({
      ...payload,
      plate: 'plate' in payload ? normalizePlate(payload.plate) : vehicle.plate,
    })
    await vehicle.save()

    return vehicle
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const vehicle = await Vehicle.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await vehicle.delete()

    return response.noContent()
  }
}
