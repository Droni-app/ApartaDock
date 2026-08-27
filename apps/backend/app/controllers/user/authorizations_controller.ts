import type { HttpContext } from '@adonisjs/core/http'
import Authorization from '#models/authorization'

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


  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}