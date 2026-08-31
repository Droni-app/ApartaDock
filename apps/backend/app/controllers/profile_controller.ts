import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { updatePasswordValidator, upDataValidator } from '#validators/user'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class ProfileController {
  async show({ auth }: HttpContext) {
    return User.reveal(auth.getUserOrFail())
  }

  /**
   * Update the authenticated user's own password
   */
  async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { currentPassword, password } = await request.validateUsing(updatePasswordValidator)

    const isCurrentPasswordValid = await hash.verify(user.password, currentPassword)
    if (!isCurrentPasswordValid) {
      return response.badRequest({ message: 'La contrasena actual no es correcta.' })
    }

    user.password = password
    await user.save()

    return response.ok({ message: 'Contrasena actualizada correctamente.' })
  }

  async upData({ auth, request, response }: HttpContext) {
    const user = await User.findOrFail(auth.getUserOrFail().id)
    const payload = await request.validateUsing(upDataValidator)

    const existDocument = await User.query()
      .where('documentType', payload.documentType)
      .andWhere('document', payload.document)
      .andWhereNot('id', user.id)
      .first()

    if (existDocument) {
      return response.badRequest({ message: 'El número de documento ya esta en uso.' })
    }

    user.fullName = payload.fullName
    user.documentType = payload.documentType
    user.document = payload.document
    user.phone = payload.phone
    user.consentDate = DateTime.now()
    await user.save()
  }
}
