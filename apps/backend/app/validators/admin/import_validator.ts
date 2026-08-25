import vine from '@vinejs/vine'

export const usersValidator = vine.create({
  file: vine.file({
    extnames: ['csv'],
  }),
})
