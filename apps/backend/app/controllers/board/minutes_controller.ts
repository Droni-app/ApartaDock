import type { HttpContext } from '@adonisjs/core/http'
import Minute from '#models/minute'
import { createMinuteValidator, updateMinuteValidator } from '#validators/board/minute_validator'

export default class MinutesController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))

    const minutes = await Minute.query().preload('user').orderBy('created_at', 'desc').paginate(page, limit)

    return minutes
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createMinuteValidator)

    const minute = await Minute.create({
      ...payload,
      userId: user.id,
    })

    return minute
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const minute = await Minute.query().where('id', params.id).preload('user').firstOrFail()
    return minute
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const minute = await Minute.findOrFail(params.id)

    if (minute.userId !== user.id) {
      return response.forbidden({ message: 'Solo el autor de la minuta puede actualizarla.' })
    }

    const payload = await request.validateUsing(updateMinuteValidator)
    minute.merge(payload)
    await minute.save()

    return minute
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Solo un administrador puede eliminar minutas.' })
    }

    const minute = await Minute.findOrFail(params.id)
    await minute.delete()

    return response.noContent()
  }
}
