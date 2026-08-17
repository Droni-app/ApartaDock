import type { User } from './users'

export interface Document {
  id: number
  userId: number
  name: string
  category: string
  picture: string
  document: string
  content: string
  active: boolean
  createdAt: string | null
  updatedAt: string | null
  user?: User | null
}