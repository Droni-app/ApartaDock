import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'
import {
  createDocumentValidator,
  updateDocumentValidator,
} from '#validators/board/document_validator'

export default class DocumentsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const q = request.input('q', '')
    const category = request.input('category', '')

    const documents = await Document.query()
      .if(q, (query) => {
        query.where('name', 'like', `%${q}%`)
      })
      .if(category, (query) => {
        query.where('category', category)
      })
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return documents
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createDocumentValidator)

    const document = await Document.create({
      ...payload,
      userId: user.id,
    })

    return document
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const document = await Document.query().where('id', params.id).preload('user').firstOrFail()
    return document
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const document = await Document.findOrFail(params.id)

    if (document.userId !== user.id) {
      return response.forbidden({ message: 'Solo el autor del documento puede actualizarlo.' })
    }

    const payload = await request.validateUsing(updateDocumentValidator)
    document.merge(payload)
    await document.save()

    return document
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const document = await Document.findOrFail(params.id)

    if (document.userId !== user.id) {
      return response.forbidden({ message: 'Solo el autor del documento puede eliminarlo.' })
    }

    await document.delete()
    return response.noContent()
  }
}
