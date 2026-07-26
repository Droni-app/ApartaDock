import type { Enrollment } from './enrollments'

export interface User {
  id: number
  fullName: string | null
  email: string
  document: string | null
  documentType: string
  phone: string | null
  role: string
  enrollments?: Enrollment[]
}
