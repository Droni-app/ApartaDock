import type { User } from './users'
import type { Unit } from './units'
import type { Vehicle } from './vehicles'

export type ParkingRequestPeriod = 'h1' | 'h2'
export type ParkingRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface ParkingRequest {
  id: number
  userId: number
  unitId: number
  vehicleId: number | null
  period: ParkingRequestPeriod | string
  periodYear: number
  insurancePolicy: string | null
  technicalReview: string | null
  authorization: string | null
  status: ParkingRequestStatus | string
  notes: string | null
  createdAt: string | null
  updatedAt: string | null
  user?: User | null
  unit?: Unit | null
  vehicle?: Vehicle | null
}
