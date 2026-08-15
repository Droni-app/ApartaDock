import type { User } from './users'

export interface Document {
  id: number
  userId: number
  name: string
  category: string | null
  picture: string | null
  document: string | null
  content: string | null
  active: boolean | null
  createdAt: string | null
  updatedAt: string | null
  user?: User | null
}