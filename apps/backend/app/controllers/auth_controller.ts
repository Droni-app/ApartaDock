import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { loginValidator, signupValidator } from '#validators/user'

export default class AuthController {
	async signup({ request, serialize }: HttpContext) {
		const { fullName, email, documentType, document, password } =
			await request.validateUsing(signupValidator)

		const user = await User.create({ fullName, email, documentType, document, password })
		const token = await User.accessTokens.create(user)

		return serialize({
			user: UserTransformer.transform(user),
			token: token.value!.release(),
		})
	}

	async login({ request, serialize }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator)

		const user = await User.verifyCredentials(email, password)
		const token = await User.accessTokens.create(user)

		return serialize({
			user: UserTransformer.transform(user),
			token: token.value!.release(),
		})
	}
}