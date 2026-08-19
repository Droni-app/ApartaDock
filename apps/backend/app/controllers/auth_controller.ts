import User from '#models/user'
import Enrollment from '#models/enrollment'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/user'

export default class AuthController {
  async login({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    const enrollments = await Enrollment.query().where('user_id', user.id)

    return serialize({
      user,
      enrollments,
      token: token.value!.release(),
    })
  }
}
