import vine from '@vinejs/vine'

export const createDocumentValidator = vine.create({
  name: vine.string().trim().maxLength(255),
  description: vine.string().trim().nullable().optional(),
  document: vine.string().trim().nullable().optional(),
  content: vine.string().trim().nullable().optional(),
  active: vine.boolean().optional(),
})

export const updateDocumentValidator = vine.create({
  name: vine.string().trim().maxLength(255).optional(),
  description: vine.string().trim().nullable().optional(),
  document: vine.string().trim().nullable().optional(),
  content: vine.string().trim().nullable().optional(),
  active: vine.boolean().optional(),
})
