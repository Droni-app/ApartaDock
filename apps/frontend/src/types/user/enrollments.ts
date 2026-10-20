import type { Enrollment } from '@/types/admin/enrollments'
import type { ParkingRequest } from '@/types/board/parking-requests'

export interface EnrollmentDetail extends Enrollment {
  parkingRequests: ParkingRequest[]
}
