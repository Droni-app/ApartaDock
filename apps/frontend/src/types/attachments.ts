export interface Attachment {
  id: number
  userId: number
  name: string
  path: string
  size: number
  mime: string
  createdAt: string | null
}
