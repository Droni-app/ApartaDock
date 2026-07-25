export interface AuthUser {
  id: number
  fullName: string | null
  email: string
  documentType: string
  document: string | null
  role: string
  phone: string | null
  createdAt: string
  updatedAt: string | null
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
