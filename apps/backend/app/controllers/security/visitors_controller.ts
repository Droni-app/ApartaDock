import type { HttpContext } from '@adonisjs/core/http'
import Visitor from '#models/visitor'
import Authorization from '#models/authorization'
import { createVisitorValidator } from '#validators/security/visitor_validator'
import { DateTime } from 'luxon'
import { visitorParking } from '#services/visitors'

interface VisitorAggregateRow {
  total?: number | string | null
  totalHours?: number | string | null
}

function normalizePlate(plate: string | null | undefined): string | null {
  if (!plate) {
    return null
  }

  return plate.toUpperCase().replace(/\s+/g, '')
}

/**
 * Parses a report filter date. Accepts a date (`2026-10-20`), covering the
 * whole day, or a date with time (`2026-10-20T14:30`), covering that minute.
 */
function parseReportDate(value: string, edge: 'start' | 'end'): DateTime {
  const date = DateTime.fromISO(value)
  const unit = value.includes('T') ? 'minute' : 'day'

  return edge === 'start' ? date.startOf(unit) : date.endOf(unit)
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

    const visitors = await query.paginate(page, limit)
    const data = await Promise.all(
      visitors.all().map(async (visitor) => ({
        ...visitor.serialize(),
        parking: await visitorParking(visitor),
      }))
    )

    return { ...visitors.toJSON(), data }
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
  async show({ params }: HttpContext) {
    const visitor = await Visitor.query().where('id', params.id).preload('unit').firstOrFail()

    if (visitor.checkinDate && visitor.checkoutDate && visitor.hours === null) {
      const parking = await visitorParking(visitor)
      visitor.hours = parking?.hours ?? 0
      visitor.total = parking?.price ?? 0
      await visitor.save()
    }
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
    const parking = await visitorParking(visitor)
    visitor.hours = parking?.hours ?? 0
    visitor.total = parking?.price ?? 0
    await visitor.save()

    return visitor
  }

  async report({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))
    const now = DateTime.now()
    const fromDateInput = request.input('fromDate')
    const toDateInput = request.input('toDate')
    const fromDate = fromDateInput
      ? parseReportDate(String(fromDateInput), 'start')
      : now.minus({ days: 30 })
    const toDate = toDateInput ? parseReportDate(String(toDateInput), 'end') : now
    const vehicleType = request.input('vehicleType', request.input('vehicle_type', ''))

    const query = Visitor.query()
      .whereBetween('checkoutDate', [fromDate.toSQL()!, toDate.toSQL()!])
      .andWhereNotNull('checkoutDate')
      .if(vehicleType, (builder) => builder.where('vehicleType', vehicleType))

    const [visitors, totalResult, totalHoursResult] = await Promise.all([
      query
        .clone()
        .preload('unit')
        .preload('authorization')
        .orderBy('checkinDate', 'desc')
        .paginate(page, limit),
      query.clone().pojo().sum('total as total'),
      query.clone().pojo().sum('hours as totalHours'),
    ])
    const totalAmount = (totalResult[0] as VisitorAggregateRow | undefined)?.total
    const totalHours = (totalHoursResult[0] as VisitorAggregateRow | undefined)?.totalHours

    return {
      ...visitors.toJSON(),
      total: Number(totalAmount ?? 0),
      totalHours: Number(totalHours ?? 0),
    }
  }
}
