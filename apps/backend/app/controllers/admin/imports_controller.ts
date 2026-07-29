import type { HttpContext } from '@adonisjs/core/http'
import { readFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import User from '#models/user'
import Unit from '#models/unit'
import Vehicle from '#models/vehicle'
import ParkingRequest from '#models/parking_request'
import Enrollment from '#models/enrollment'

interface ParkingRequestImportRow {
  created_at: string
  user_name: string
  user_phone: number | string
  user_email: string
  unit_tower: number | string
  unit_apto: number | string
  vehicle_type: string
  vehicle_is_owner: string
  vehicle_owner_name: string
  vehicle_plate: string
  vehicle_owner_card: string | null
  unit_status: string
  user_rented_status: string
  parking_request_authorization: string
  parking_request_notes: string
  ADM: string
}

function parseCreatedAt(raw: string): DateTime {
  const createdAt = DateTime.fromFormat(String(raw ?? ''), 'M/d/yyyy H:mm:ss')
  if (!createdAt.isValid) {
    throw new Error(`created_at invalido: ${raw}`)
  }
  return createdAt
}

function parseApto(raw: number | string): number {
  const digits = String(raw ?? '').replace(/\D/g, '')
  const apto = Number.parseInt(digits, 10)
  if (!digits || Number.isNaN(apto)) {
    throw new Error(`unit_apto invalido: ${raw}`)
  }
  return apto
}

function normalizePhone(raw: number | string): string | null {
  const digits = String(raw ?? '').replace(/\D/g, '')
  return digits ? digits.slice(-10) : null
}

function normalizePlate(raw: string): string {
  return String(raw ?? '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .slice(0, 20)
}

function mapVehicleType(raw: string): 'car' | 'motorcycle' | 'bicycle' | 'truck' | 'other' {
  const value = String(raw ?? '').trim().toLowerCase()
  if (value.includes('bicicleta') && value.includes('moto')) return 'other'
  if (value.includes('moto')) return 'motorcycle'
  if (value.includes('bicicleta') || value.includes('bici')) return 'bicycle'
  if (value.includes('camion') || value.includes('camión') || value.includes('truck')) return 'truck'
  if (value.includes('carro') || value.includes('auto') || value.includes('car')) return 'car'
  return 'other'
}

async function getAvailableTempDocument(base: string): Promise<string> {
  let candidate = base
  let suffix = 2
  while (await User.query().where('documentType', 'CC').where('document', candidate).first()) {
    candidate = `${base}_${suffix}`
    suffix += 1
  }
  return candidate
}

export default class ImportsController {
  /**
   * Import parking request data from json file
   */
  async parking_requests({ request, response }: HttpContext) {
    const file = request.file('file', { extnames: ['json'] })

    if (!file) {
      return response.badRequest({ message: 'Debes adjuntar un archivo json en el campo "file".' })
    }

    if (!file.isValid) {
      return response.badRequest({ message: 'Archivo invalido.', errors: file.errors })
    }

    let rows: ParkingRequestImportRow[]
    try {
      const raw = await readFile(file.tmpPath!, 'utf-8')
      rows = JSON.parse(raw)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return response.badRequest({ message: 'No se pudo leer el archivo json.', error: message })
    }

    let usersCreated = 0
    let usersUpdated = 0
    let vehiclesCreated = 0
    let vehiclesUpdated = 0
    let enrollmentsCreated = 0
    let enrollmentsUpdated = 0
    let parkingRequestsCreated = 0
    const errors: Array<{ index: number; row: string; message: string }> = []

    for (const [index, row] of rows.entries()) {
      const rowLabel = `${row.unit_tower}-${row.unit_apto} (${row.user_email})`

      try {
        const createdAt = parseCreatedAt(row.created_at)
        const tower = Number.parseInt(String(row.unit_tower ?? ''), 10)
        const apto = parseApto(row.unit_apto)
        const unitName = `${tower}${apto}`

        const unit = await Unit.findBy('name', unitName)
        if (!unit) {
          throw new Error(`Unidad no encontrada: ${unitName}`)
        }

        const unitStatusRaw = String(row.unit_status ?? '').trim().toUpperCase()
        const isTenant = unitStatusRaw === 'SI'
        if (unitStatusRaw === 'SI' || unitStatusRaw === 'NO') {
          unit.merge({ status: isTenant ? 'rented' : 'occupied', updatedAt: createdAt })
          await unit.save()
        }

        const email = String(row.user_email ?? '').trim().toLowerCase()
        if (!email) {
          throw new Error('user_email vacio')
        }

        const fullName = String(row.user_name ?? '').trim()
        const phone = normalizePhone(row.user_phone)

        let user = await User.findBy('email', email)
        if (user) {
          user.merge({ fullName, phone, updatedAt: createdAt })
          await user.save()
          usersUpdated += 1
        } else {
          const tempDocument = await getAvailableTempDocument(`temp_${tower}${apto}`)
          user = await User.create({
            fullName,
            email,
            phone,
            documentType: 'CC',
            document: tempDocument,
            password: randomBytes(12).toString('hex'),
            createdAt,
            updatedAt: createdAt,
          })
          usersCreated += 1
        }

        const plate = normalizePlate(row.vehicle_plate)
        const vehicleType = mapVehicleType(row.vehicle_type)
        const isOwner = String(row.vehicle_is_owner ?? '').trim().toUpperCase() === 'SI'
        const ownerName = String(row.vehicle_owner_name ?? '').trim() || fullName
        const ownerCard = String(row.vehicle_owner_card ?? '').trim()
        const ownerDocument = user.document ?? `temp_${tower}${apto}`

        let vehicle = await Vehicle.query().where('userId', user.id).where('plate', plate).first()
        if (vehicle) {
          vehicle.merge({
            vehicleType,
            isOwner,
            ownerName: ownerName || vehicle.ownerName,
            ownerCard: ownerCard || vehicle.ownerCard,
            ownerDocument,
          })
          await vehicle.save()
          vehiclesUpdated += 1
        } else {
          vehicle = await Vehicle.create({
            userId: user.id,
            plate,
            vehicleType,
            isOwner,
            ownerName,
            ownerCard,
            ownerDocument,
            year: 0,
            createdAt,
          })
          vehiclesCreated += 1
        }

        const authorization = String(row.parking_request_authorization ?? '').trim() || null
        const notes = `${row.parking_request_notes ?? ''}. Arrendatario: ${row.user_rented_status ?? ''} | ${row.ADM ?? ''}`

        await ParkingRequest.create({
          userId: user.id,
          unitId: unit.id,
          vehicleId: vehicle.id,
          period: 'h2',
          periodYear: 2026,
          authorization,
          notes,
          createdAt,
          updatedAt: createdAt,
        })
        parkingRequestsCreated += 1

        const role = isTenant ? 'tenant' : 'resident'
        let enrollment = await Enrollment.query().where('userId', user.id).where('unitId', unit.id).first()
        if (enrollment) {
          enrollment.merge({ role, updatedAt: createdAt })
          await enrollment.save()
          enrollmentsUpdated += 1
        } else {
          await Enrollment.create({
            userId: user.id,
            unitId: unit.id,
            role,
            createdAt,
            updatedAt: createdAt,
          })
          enrollmentsCreated += 1
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        errors.push({ index, row: rowLabel, message })
      }
    }

    return response.ok({
      total: rows.length,
      processed: rows.length - errors.length,
      users: { created: usersCreated, updated: usersUpdated },
      vehicles: { created: vehiclesCreated, updated: vehiclesUpdated },
      parkingRequests: { created: parkingRequestsCreated },
      enrollments: { created: enrollmentsCreated, updated: enrollmentsUpdated },
      errors,
    })
  }
}
