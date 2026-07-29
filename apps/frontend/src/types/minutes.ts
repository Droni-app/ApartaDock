import type { User } from './users'

export interface Minute {
  id: number
  userId: number
  name: string
  description: string | null
  document: string | null
  content: string | null
  active: boolean | null
  createdAt: string | null
  updatedAt: string | null
  user?: User | null
}
