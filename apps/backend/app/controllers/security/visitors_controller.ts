import type { HttpContext } from '@adonisjs/core/http'
import Visitor from '#models/visitor'
import Authorization from '#models/authorization'
import { createVisitorValidator } from '#validators/security/visitor_validator'
import { DateTime } from 'luxon'

function normalizePlate(plate: string | null | undefined): string | null {
  if (!plate) {
    return null
  }

  return plate.toUpperCase().replace(/\s+/g, '')
}

export default class VisitorsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const q = request.input('q', '')
    const checkout = request.input('checkout', null)

    const query = Visitor.query()
      .preload('unit')
      .preload('authorization', async (builder) => {
        await builder.preload('user')
      })
      .if(q, async (unitQuery) => {
        await unitQuery.where('fullName', 'like', `%${q}%`).orWhere('plate', 'like', `%${q}%`)
      })
      .if(checkout !== 'true', async (builder) => {
        await builder.whereNull('checkoutDate')
      })
      .orderBy('checkinDate', 'desc')

    return await query.paginate(page, limit)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createVisitorValidator)
    let checkinDate = null

    if (payload.authorizationId) {
      await Authorization.query().where('id', payload.authorizationId).firstOrFail()
      checkinDate = DateTime.now()
    }

    return await Visitor.create({
      ...payload,
      userId: user.id,
      plate: normalizePlate(payload.plate),
      checkinDate,
    })
  }

  /**
   * Show individual record
   */
  async show({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()

    return await Visitor.query()
      .where('id', params.id)
      .if(user.role !== 'admin', async (builder) => {
        await builder.where('userId', user.id)
      })
      .preload('unit')
      .firstOrFail()
  }

  async checkin({ params }: HttpContext) {
    const visitor = await Visitor.query().where('id', params.id).firstOrFail()
    if (visitor.checkinDate) {
      throw new Error('Visitor is already checked in')
    }
    visitor.checkinDate = DateTime.now()
    await visitor.save()

    return visitor
  }

  async checkout({ params }: HttpContext) {
    const visitor = await Visitor.query().where('id', params.id).firstOrFail()

    if (!visitor.checkinDate) {
      throw new Error('Visitor is not checked in')
    }

    if (visitor.checkoutDate) {
      throw new Error('Visitor is already checked out')
    }

    visitor.checkoutDate = DateTime.now()
    await visitor.save()

    return visitor
  }
}
