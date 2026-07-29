import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { updatePasswordValidator } from '#validators/user'

export default class ProfileController {
  async show({ auth }: HttpContext) {
    return auth.getUserOrFail()
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
}
