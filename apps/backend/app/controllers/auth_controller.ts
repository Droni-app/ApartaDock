import User from '#models/user'
import Enrollment from '#models/enrollment'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/user'
import mail from '@adonisjs/mail/services/main'
import { signedUrlFor } from '@adonisjs/core/services/url_builder'
import { appUrl } from '#config/app'

export default class AuthController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    const enrollments = await Enrollment.query().where('user_id', user.id)

    return {
      user,
      enrollments,
      token: token.value!.release(),
    }
  }
  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return {
      message: 'Logged out successfully',
    }
  }
  async resetPassword({ request }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (user) {
      const resetUrl = signedUrlFor(
        'auth.password.update',
        { email },
        {
          expiresIn: '1 days',
          prefixUrl: appUrl,
        }
      )

      // Send the new password to the user's email
      mail.send((message) => {
        message
          .to(user.email)
          .subject('Recuperar contraseña')
          .htmlView('emails/reset_password', { user, resetUrl })
      })
    }

    return {
      message: 'Correo de recuperación de contraseña enviado.',
    }
  }
  async updatePassword({ request, response, auth }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.badRequest('Invalid or expired link')
    }
    const user = auth.getUserOrFail()
    const newPassword = request.input('new_password')
    user.password = newPassword
    await user.save()

    return {
      message: 'Password updated successfully',
    }
  }
}
