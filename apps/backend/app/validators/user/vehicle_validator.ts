import vine from '@vinejs/vine'

export const createVehicleValidator = vine.create({
  plate: vine.string().trim().maxLength(20).nullable().optional(),
  isOwner: vine.boolean().optional(),
  ownerCard: vine.string().trim(),
  ownerName: vine.string().trim(),
  ownerDocument: vine.string().trim(),
  driverLicense: vine.string().trim().nullable().optional(),
  brand: vine.string().trim().nullable().optional(),
  model: vine.string().trim().nullable().optional(),
  color: vine.string().trim().nullable().optional(),
  year: vine.number(),
  vehicleType: vine.enum(['car', 'motorcycle', 'bicycle', 'truck', 'other']),
})

export const updateVehicleValidator = vine.create({
  plate: vine.string().trim().maxLength(20).nullable().optional(),
  isOwner: vine.boolean().optional(),
  ownerCard: vine.string().trim().optional(),
  ownerName: vine.string().trim().optional(),
  ownerDocument: vine.string().trim().optional(),
  driverLicense: vine.string().trim().nullable().optional(),
  brand: vine.string().trim().nullable().optional(),
  model: vine.string().trim().nullable().optional(),
  color: vine.string().trim().nullable().optional(),
  year: vine.number().optional(),
  vehicleType: vine.enum(['car', 'motorcycle', 'bicycle', 'truck', 'other']).optional(),
})
