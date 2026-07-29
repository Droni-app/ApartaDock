import vine from '@vinejs/vine'

/**
 * Shared rule for email.
 */
const email = () => vine.string().email().maxLength(254)

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

/**
 * Validator to use when a user updates their own password
 */
export const updatePasswordValidator = vine.create({
  currentPassword: vine.string(),
  password: vine.string().minLength(8).maxLength(32).confirmed(),
})
