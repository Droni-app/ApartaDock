import vine from '@vinejs/vine'

export const createTicketValidator = vine.create({
  unitId: vine.number(),
  name: vine.string().trim(),
  owners: vine.array(vine.enum(['admin', 'board', 'security', 'connivance'])),
  content: vine.string(),
  attachment: vine.string().optional(),
})
