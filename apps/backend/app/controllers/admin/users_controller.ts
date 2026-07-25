import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator, createUserValidator } from '#validators/admin/user_validator'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))

    const users = await User.query().orderBy('updated_at', 'desc').paginate(page, limit)
    return users
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const emailExists = await User.findBy('email', payload.email)
    if (emailExists) {
      return response.conflict({ message: 'El correo ya esta en uso.' })
    }

    if (payload.document) {
      const documentExists = await User.findBy('document', payload.document)
      if (documentExists) {
        return response.conflict({ message: 'El documento ya esta en uso.' })
      }
    }

    const user = await User.create(payload)
    return response.created(user)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const user = await User.query()
      .preload('enrollments', (enrollmentsQuery) => {
        enrollmentsQuery.preload('unit')
      }).where('id', params.id).firstOrFail()
    return user
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator)

    if (payload.email && payload.email !== user.email) {
      const emailExists = await User.query()
        .where('email', payload.email)
        .whereNot('id', user.id)
        .first()

      if (emailExists) {
        return response.conflict({ message: 'El correo ya esta en uso.' })
      }
    }

    if (payload.document && payload.document !== user.document) {
      const documentExists = await User.query()
        .where('document', payload.document)
        .whereNot('id', user.id)
        .first()

      if (documentExists) {
        return response.conflict({ message: 'El documento ya esta en uso.' })
      }
    }

    user.merge(payload)
    await user.save()

    return user
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.noContent()
  }
}