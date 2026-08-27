import type { HttpContext } from '@adonisjs/core/http'
import Authorization from '#models/authorization'
import {
  createAuthorizationValidator,
  editAuthorizationValidator,
} from '#validators/user/authorization'

export default class AuthorizationsController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const authorizations = await Authorization.query()
      .where('user_id', user.id)
      .orderBy('updated_at', 'desc')
      .paginate(20)

    return authorizations
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = request.validateUsing(createAuthorizationValidator)
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
