import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket'
import Unit from '#models/unit'
import { createTicketValidator } from '#validators/user/ticket'

export default class TicketsController {
  /**
   * Display a list of resource
   */
  async index({ auth, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const q = request.input('q', '')
    const user = auth.getUserOrFail()
    const tickets = await Ticket.query()
      .if(q, (query) => {
        query.where('name', 'like', `%${q}%`)
      })
      .where('userId', user.id)
      .preload('unit')
      .orderBy('updatedAt', 'desc')
      .paginate(page, limit)

    return tickets
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createTicketValidator)
    const unit = await Unit.query()
      .whereHas('enrollments', (query) => query.where('user_id', user.id))
      .firstOrFail()
    const ticket = new Ticket()
    ticket.userId = user.id
    ticket.unitId = unit.id
    ticket.name = payload.name
    ticket.owners = JSON.stringify(payload.owners)
    ticket.priority = payload.priority
    ticket.content = payload.content
    ticket.attachment = payload.attachment ?? null

    await ticket.save()
    return ticket
  }

  /**
   * Show individual record
   */
  async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const ticket = await Ticket.query()
      .where('id', params.id)
      .andWhere('user_id', user.id)
      .firstOrFail()

    return ticket
  }
}
