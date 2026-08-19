import vine from '@vinejs/vine'

export const storeAttachmentValidator = vine.create({
  name: vine.string(),
  visibility: vine.enum(['private', 'public']).optional(),
  file: vine.file({
    size: '5mb',
    extnames: [
      'jpeg',
      'jpg',
      'png',
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'zip',
      'text',
      'markdown',
    ],
  }),
})
