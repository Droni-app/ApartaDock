import type { PaginatedResponse } from '@/types/api'
import type { User } from '@/types/admin/users'

export type VisitorVehicleType = 'car' | 'motorcycle'

export interface Visitor {
  id: number
  userId: number
  unitId: number
  authorizationId: number | null
  fullName: string
  document: string | null
  plate: string | null
  vehicleType: VisitorVehicleType | null
  checkinDate: string | null
  checkoutDate: string | null
  hours: number | null
  total: number | null
  parking: { hours: number, price: number } | null
  createdAt: string
  updatedAt: string
  unit?: {
    id: number
    name: string
    tower: number
    apto: number
    floor: number
    typology: number
    status: string
  } | null
}

export interface VisitorForm {
  unitId: number | null
  authorizationId: number | null
  fullName: string
  document: string
  plate: string | null
  vehicleType: VisitorVehicleType | null
  checkinDate: string | null
  checkoutDate: string | null
}

export interface VisitorReportRow {
  id: number
  fullName: string | null
  document: string | null
  plate: string | null
  vehicleType: string | null
  checkinDate: string | null
  checkoutDate: string | null
  hours: number | null
  total: number | null
  unit: { name: string; tower: number; apto: number } | null
  authorization: { fullName: string | null } | null
  user: User | null
}

export interface VisitorReportResponse extends PaginatedResponse<VisitorReportRow> {
  total?: number
  totalHours?: number
}
