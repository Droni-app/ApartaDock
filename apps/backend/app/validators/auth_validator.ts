import vine from '@vinejs/vine'

export const loginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(255),
})

export const registerValidator = vine.create({
  fullName: vine.string().minLength(10),
  documentType: vine.enum(['CC', 'CE', 'TI', 'PP']),
  document: vine.string(),
  unitName: vine.string(),
  email: vine.string().email().confirmed(),
  phone: vine.string().fixedLength(10).confirmed(),
})

export const updatePasswordValidator = vine.create({
  email: vine.string().email(),
  newPassword: vine.string().minLength(8).maxLength(255).confirmed(),
})
