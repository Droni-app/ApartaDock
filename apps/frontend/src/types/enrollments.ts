import type { User } from './users'
import type { Unit } from './units'
import type { ParkingRequest } from './parking_requests'

export type EnrollmentRole = 'tenant' | 'owner' | 'resident'

export interface Enrollment {
  id: number
  role: EnrollmentRole | string
  unitId: number | null
  userId: number | null
  user?: User | null
  unit?: Unit | null
}

export interface EnrollmentDetail extends Enrollment {
  parkingRequests: ParkingRequest[]
}
