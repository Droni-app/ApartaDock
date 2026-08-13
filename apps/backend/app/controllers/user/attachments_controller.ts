import type { HttpContext } from '@adonisjs/core/http'
import Attachment from '#models/attachment'
import { storeAttachmentValidator } from '#validators/attachment'
import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'

export default class AttachmentsController {
  async index({ auth, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const attachments = await Attachment.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
    return attachments
  }
  async store({ auth, request }: HttpContext) {
    const data = await request.validateUsing(storeAttachmentValidator)

    // Generar ruta única por usuario y mantenerla consistente con la que luego se consulta
    const path = `${auth.user!.id}/${data.file.size}-${string.slug(data.file.clientName)}`

    // store file
    await data.file.moveToDisk(path)

    const attachment = await Attachment.create({
      userId: auth.user!.id,
      name: data.name ?? data.file.clientName,
      path,
      size: data.file.size,
      mime: data.file.subtype ? `${data.file.type}/${data.file.subtype}` : data.file.type ?? 'application/octet-stream',
    })
    return attachment
  }
  async show({ auth, params, response }: HttpContext) {
    const attachment = await Attachment.query()
      .where('user_id', auth.user!.id)
      .where('id', params.id)
      .firstOrFail()

    const disk = drive.use()
    const fileBuffer = await disk.get(attachment.path)

    response.header('Content-Type', attachment.mime)
    response.header('Content-Disposition', `inline; filename="${attachment.name}"`)
    return fileBuffer
  }
  async destroy({ auth, params }: HttpContext) {
    const attachment = await Attachment.query()
      .where('user_id', auth.user!.id)
      .where('id', params.id)
      .firstOrFail()
    // Eliminar el archivo físico
    const disk = drive.use()
    await disk.delete(attachment.path)

    await attachment.delete()
    return attachment
  }
  async download({ auth, request, response }: HttpContext) {
    const attachmentPath = request.input('path')

    if (!attachmentPath) {
      return response.badRequest('Se requiere el parametro path')
    }

    const attachment = await Attachment.query()
      .where('user_id', auth.user!.id)
      .where('path', attachmentPath)
      .firstOrFail()

    const disk = drive.use()
    const url = await disk.getSignedUrl(attachment.path, {
      expiresIn: '1 mins',
    })
    return { url }
  }
}