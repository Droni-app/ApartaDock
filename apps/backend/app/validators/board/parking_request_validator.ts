import vine from '@vinejs/vine'

export const updateParkingRequestValidator = vine.create({
  period: vine.enum(['h1', 'h2']).optional(),
  periodYear: vine.number().optional(),
  insurancePolicy: vine.string().trim().nullable().optional(),
  technicalReview: vine.string().trim().nullable().optional(),
  authorization: vine.string().trim().nullable().optional(),
  status: vine.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(),
  notes: vine.string().trim().optional(),
})
