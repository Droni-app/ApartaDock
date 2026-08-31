import vine from '@vinejs/vine'

export const createVisitorValidator = vine.create({
  unitId: vine.number(),
  authorizationId: vine.number().nullable().optional(),
  fullName: vine.string().trim(),
  document: vine.string().trim().nullable().optional(),
  plate: vine.string().trim().maxLength(20).nullable().optional(),
  vehicleType: vine.enum(['car', 'motorcycle']).nullable().optional(),
})

export const updateVisitorValidator = vine.create({
  authorizationId: vine.number().nullable().optional(),
  checkinDate: vine.date().nullable().optional(),
  checkoutDate: vine.date().nullable().optional(),
})
