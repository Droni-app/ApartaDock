import type { HttpContext } from '@adonisjs/core/http'
import Visitor from '#models/visitor'
import Authorization from '#models/authorization'
import {
  createVisitorValidator,
  updateVisitorValidator,
} from '#validators/security/visitor_validator'
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
  async index({ auth, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const q = request.input('q', '')

    const query = Visitor.query()
      .preload('unit')
      .if(q, (builder) => {
        builder.where('fullName', 'like', `%${q}%`).orWhere('plate', 'like', `%${q}%`)
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
      .if(user.role !== 'admin', (builder) => {
        builder.where('userId', user.id)
      })
      .preload('unit')
      .firstOrFail()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request }: HttpContext) {
    const payload = await request.validateUsing(updateVisitorValidator)
    const visitor = await Visitor.query().where('id', params.id).firstOrFail()
    console.log(payload)
    await visitor.save()
    return visitor
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
