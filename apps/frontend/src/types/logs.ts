import type { User } from './users'

export interface Log {
  id: number
  userId: number
  endpoint: string
  method: string
  payload: string | null
  createdAt: string | null
  user?: User | null
}
