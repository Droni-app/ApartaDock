import { DateTime } from 'luxon'
import Visitor from '#models/visitor'

export interface VisitorParking {
  hours: number
  price: number
}

/**
 * Free parking minutes per vehicle (plate) per calendar day. A stay counts
 * against the day it checked in, so an overnight stay only gets them once.
 */
export const FREE_MINUTES_PER_DAY = 120

const TARIFFS: Record<string, number> = {
  car: 2000,
  motorcycle: 1000,
  bicycle: 500,
}

function stayMinutes(checkin: DateTime, checkout: DateTime | null): number {
  const end = checkout ?? DateTime.now()
  return Math.max(0, end.diff(checkin, 'minutes').minutes)
}

export function vistorParkingCalc(
  checkin: DateTime,
  checkout: DateTime | null,
  vehicleType: string,
  freeMinutes: number = FREE_MINUTES_PER_DAY
): VisitorParking {
  const minutes = stayMinutes(checkin, checkout)
  const billableMinutes = Math.max(0, minutes - freeMinutes)
  const pricePerHour = TARIFFS[vehicleType] || 0

  return {
    hours: Math.ceil(minutes / 60),
    price: Math.ceil(billableMinutes / 60) * pricePerHour,
  }
}

/**
 * Free minutes the visitor still has on its check-in day, after discounting
 * the time used by earlier stays of the same plate that same day.
 */
async function availableFreeMinutes(visitor: Visitor): Promise<number> {
  if (!visitor.plate || !visitor.checkinDate) {
    return FREE_MINUTES_PER_DAY
  }

  const previousStays = await Visitor.query()
    .where('plate', visitor.plate)
    .whereNot('id', visitor.id)
    .where('checkinDate', '>=', visitor.checkinDate.startOf('day').toSQL()!)
    .where('checkinDate', '<', visitor.checkinDate.toSQL()!)
    .orderBy('checkinDate', 'asc')

  let freeMinutes = FREE_MINUTES_PER_DAY
  for (const stay of previousStays) {
    freeMinutes -= Math.min(freeMinutes, stayMinutes(stay.checkinDate!, stay.checkoutDate))
  }

  return freeMinutes
}

/**
 * Parking hours and price for a visitor. Uses the values stored at checkout
 * when available, otherwise estimates them up to now for visitors still inside.
 */
export async function visitorParking(visitor: Visitor): Promise<VisitorParking | null> {
  if (!visitor.checkinDate || !visitor.vehicleType) {
    return null
  }

  if (visitor.checkoutDate && visitor.hours !== null && visitor.total !== null) {
    return { hours: visitor.hours, price: visitor.total }
  }

  return vistorParkingCalc(
    visitor.checkinDate,
    visitor.checkoutDate,
    visitor.vehicleType,
    await availableFreeMinutes(visitor)
  )
}
