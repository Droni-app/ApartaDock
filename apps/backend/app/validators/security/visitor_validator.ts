import vine from '@vinejs/vine'

export const createVisitorValidator = vine.create({
  unitId: vine.number(),
  authorizationId: vine.number().nullable().optional(),
  fullName: vine.string().trim(),
  document: vine.string().trim().nullable().optional(),
  plate: vine.string().trim().maxLength(20).nullable().optional(),
  vehicleType: vine.enum(['car', 'motorcycle', 'bicycle']).nullable().optional(),
})
