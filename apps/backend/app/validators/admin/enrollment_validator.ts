import vine from '@vinejs/vine'

export const createEnrollmentValidator = vine.create({
  userId: vine.number(),
  unitId: vine.number(),
  role: vine.enum(['tenant', 'owner', 'resident']),
})

export const updateEnrollmentValidator = vine.create({
  role: vine.enum(['tenant', 'owner', 'resident']).optional(),
})
