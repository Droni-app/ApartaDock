import type { User } from '@/types/admin/users'

export interface Log {
  id: number
  userId: number
  endpoint: string
  method: string
  payload: string | null
  createdAt: string | null
  user?: User | null
}
