import vine from '@vinejs/vine'

export const loginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string(),
})

export const updatePasswordValidator = vine.create({
  currentPassword: vine.string(),
  password: vine.string().minLength(8).maxLength(32).confirmed(),
})
export const upDataValidator = vine.create({
  fullName: vine.string(),
  documentType: vine.enum(['CC', 'CE', 'TI', 'PP']),
  document: vine.string().trim().maxLength(20),
  phone: vine.string().trim().maxLength(20),
})
