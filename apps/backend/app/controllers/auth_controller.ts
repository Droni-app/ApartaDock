import User from '#models/user'
import Enrollment from '#models/enrollment'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, updatePasswordValidator } from '#validators/auth_validator'
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
        { id: user.id },
        {
          expiresIn: '20 minutes',
          prefixUrl: appUrl,
        }
      )
      // get signatura
      const signature = resetUrl.split('signature=')[1]

      // Send the new password to the user's email
      mail
        .send((message) => {
          message
            .to(user.email)
            .subject('Recuperar contraseña')
            .htmlView('emails/reset_password', { user, signature })
        })
        .catch((error) => {
          console.error('Error sending password reset email:', error)
        })
    }

    return {
      message: 'Correo de recuperación de contraseña enviado.',
    }
  }
  async updatePassword({ request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.badRequest('Invalid or expired link')
    }
    const id = request.param('id')
    const { email, newPassword } = await request.validateUsing(updatePasswordValidator)
    const user = await User.query().where('id', id).where('email', email).firstOrFail()
    user.password = newPassword
    await user.save()

    return {
      message: 'Password updated successfully',
    }
  }
}
