import vine from '@vinejs/vine'

export const createDocumentValidator = vine.create({
  name: vine.string().trim().maxLength(255),
  category: vine.string().trim().maxLength(255).optional(),
  picture: vine.string().trim().nullable().optional(),
  document: vine.string().trim().nullable().optional(),
  content: vine.string().trim().nullable().optional(),
  active: vine.boolean().optional(),
})

export const updateDocumentValidator = vine.create({
  name: vine.string().trim().maxLength(255).optional(),
  category: vine.string().trim().maxLength(255).optional(),
  picture: vine.string().trim().nullable().optional(),
  document: vine.string().trim().nullable().optional(),
  content: vine.string().trim().nullable().optional(),
  active: vine.boolean().optional(),
})
