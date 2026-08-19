import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'

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
      .preload('user')
      .if(q, (query) => {
        query.where('name', 'like', `%${q}%`)
      })
      .if(category, (query) => {
        query.where('category', category)
      })
      .where('active', true)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return documents
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const document = await Document.query()
      .where('id', params.id)
      .andWhere('active', true)
      .preload('user')
      .firstOrFail()
    return document
  }
}
