import vine from '@vinejs/vine'

export const loginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(255),
})

export const updatePasswordValidator = vine.create({
  email: vine.string().email(),
  newPassword: vine.string().minLength(8).maxLength(255).confirmed(),
})
