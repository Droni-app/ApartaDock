import type { HttpContext } from '@adonisjs/core/http'
import Authorization from '#models/authorization'
import Enrollment from '#models/enrollment'
import {
  createAuthorizationValidator,
  editAuthorizationValidator,
} from '#validators/user/authorization'

export default class AuthorizationsController {
  /**
   * Display a list of resource
   */
  async index({ auth, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const q = request.input('q', '')
    const user = auth.getUserOrFail()
    const authorizations = await Authorization.query()
      .where('userId', user.id)
      .if(q, (query) => {
        query.where('fullName', 'like', `%${q}%`)
      })
      .orderBy('updatedAt', 'desc')
      .paginate(page, limit)

    return authorizations
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createAuthorizationValidator)
    // validate ownership on unit
    await Enrollment.query()
      .where('unitId', payload.unitId)
      .andWhere('userId', user.id)
      .firstOrFail()
    return await Authorization.create({
      userId: user.id,
      ...payload,
    })
  }

  /**
   * Show individual record
   */
  async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return await Authorization.query()
      .where('user_id', user.id)
      .andWhere('id', params.id)
      .firstOrFail()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(editAuthorizationValidator)
    // validate ownership on unit
    await Enrollment.query()
      .where('unitId', payload.unitId)
      .andWhere('userId', user.id)
      .firstOrFail()
    const authorization = await Authorization.query()
      .where('user_id', user.id)
      .andWhere('id', params.id)
      .firstOrFail()

    return await authorization.fill(payload).save()
  }

  /**
   * Delete record
   */
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const authorization = await Authorization.query()
      .where('user_id', user.id)
      .andWhere('id', params.id)
      .firstOrFail()
    await authorization.delete()
    return authorization
  }
}
