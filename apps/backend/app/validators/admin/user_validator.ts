import vine from '@vinejs/vine'

export const updateUserValidator = vine.create({
  fullName: vine.string().trim().nullable().optional(),
  email: vine.string().email().maxLength(254).optional(),
  documentType: vine.enum(['CC', 'CE', 'TI', 'PP']).optional(),
  document: vine.string().trim().maxLength(20).nullable().optional(),
  role: vine.string().trim().optional(),
  phone: vine.string().trim().maxLength(20).nullable().optional(),
  password: vine.string().minLength(8).maxLength(32).optional(),
})

export const createUserValidator = vine.create({
  fullName: vine.string().trim().nullable(),
  email: vine.string().email().maxLength(254),
  documentType: vine.enum(['CC', 'CE', 'TI', 'PP']),
  document: vine.string().trim().maxLength(20).nullable(),
  role: vine.string().trim(),
  phone: vine.string().trim().maxLength(20).nullable(),
  password: vine.string().minLength(8).maxLength(32),
})
