import type { User } from './users'
import type { Unit } from './units'

export type EnrollmentRole = 'tenant' | 'owner' | 'resident'

export interface Enrollment {
  id: number
  role: EnrollmentRole | string
  unitId: number | null
  userId: number | null
  user?: User | null
  unit?: Unit | null
}
