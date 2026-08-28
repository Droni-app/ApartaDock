import vine from '@vinejs/vine'

export const createAuthorizationValidator = vine.create({
  unitId: vine.number(),
  fullName: vine.string().trim(),
  document: vine.string().trim().optional(),
  plate: vine.string().trim().maxLength(20).optional(),
  authorizedDate: vine.date().optional(),
})

export const editAuthorizationValidator = vine.create({
  unitId: vine.number(),
  fullName: vine.string().trim(),
  document: vine.string().trim().optional(),
  plate: vine.string().trim().maxLength(20).optional(),
  authorizedDate: vine.date().optional(),
})
